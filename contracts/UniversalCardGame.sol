// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title UniversalCardGame - BNB链通用焚化炉 (多轮版)
 * @notice 限量20个座位，支持多轮同时进行的链上博弈平台
 * @dev 结合代币销毁与PvP翻牌比大小机制，支持多轮并行
 */

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
}

contract UniversalCardGame {
    // ============ 常量配置 ============
    uint256 public constant MAX_PLAYERS = 20;
    address public constant DEAD_ADDRESS = 0x000000000000000000000000000000000000dEaD;
    
    // ============ 分成比例 (基于1000) ============
    uint256 public constant POT_SHARE = 800;        // 80% 进入奖池
    uint256 public constant DEV_FEE = 50;           // 5% 开发费
    uint256 public constant NEXT_ROUND_RESERVE = 150; // 15% 下一轮储备金
    
    // ============ 状态变量 ============
    address public owner;
    address public devWallet;
    uint256 public totalRoundsCreated;  // 总轮次计数器
    
    // ============ 代币分组管理 ============
    // 每种代币的当前活跃轮次ID（0表示无活跃轮次）
    mapping(address => uint256) public tokenActiveRound;
    
    // 每种代币的储备金池
    mapping(address => uint256) public tokenReservePools;
    
    // 每种代币的历史轮次数
    mapping(address => uint256) public tokenRoundCounts;
    
    // ============ 轮次数据结构 ============
    struct Round {
        uint256 roundId;
        address tokenAddress;
        uint256 burnAmount;
        uint256 ticketPrice;
        uint256 startTime;
        uint256 endTime;
        uint256[] availableNumbers;
        address[] participants;
        mapping(address => uint256) playerNumbers;
        uint256 currentPot;
        uint256 maxNumber;
        address maxNumberHolder;
        bool isSettled;
        bool isActive;
        uint256 inheritedReserve;   // 从代币储备池继承的奖金
        string tokenName;           // 代币名称（缓存）
        string tokenSymbol;         // 代币符号（缓存）
    }
    
    mapping(uint256 => Round) public rounds;
    uint256[] public activeRounds;      // 新增：活跃轮次列表
    mapping(address => uint256[]) public playerActiveRounds;  // 新增：玩家参与的活跃轮次
    
    // ============ 事件 ============
    event RoundStarted(uint256 indexed roundId, address tokenAddress, uint256 burnAmount, uint256 ticketPrice, uint256 endTime);
    event PlayerJoined(uint256 indexed roundId, address indexed player, uint256 number);
    event RoundSettled(uint256 indexed roundId, address indexed winner, uint256 prize);
    event EmergencyWithdraw(address indexed to, uint256 amount);
    
    constructor(address _devWallet) {
        owner = msg.sender;
        devWallet = _devWallet;
        totalRoundsCreated = 0;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    // ============ 代币管理函数 ============
    
    /**
     * @notice 检查代币是否可以开启新轮次
     */
    function canStartNewRound(address tokenAddress) public view returns (bool) {
        return tokenActiveRound[tokenAddress] == 0;
    }
    
    /**
     * @notice 获取代币的储备金信息
     */
    function getTokenReserveInfo(address tokenAddress) external view returns (
        uint256 reservePool,
        uint256 activeRoundId,
        uint256 totalRounds
    ) {
        return (
            tokenReservePools[tokenAddress],
            tokenActiveRound[tokenAddress],
            tokenRoundCounts[tokenAddress]
        );
    }
    
    /**
     * @notice 安全获取代币信息（防止合约调用失败）
     */
    function getTokenInfo(address tokenAddress) internal view returns (string memory name, string memory symbol) {
        try IERC20(tokenAddress).name() returns (string memory _name) {
            name = _name;
        } catch {
            name = "Unknown Token";
        }
        
        try IERC20(tokenAddress).symbol() returns (string memory _symbol) {
            symbol = _symbol;
        } catch {
            symbol = "UNKNOWN";
        }
    }
    
    // ============ 核心功能 ============
    
    /**
     * @notice 开启新的游戏轮次（代币独占制）
     */
    function startNewRound(
        address _tokenAddress,
        uint256 _burnAmount,
        uint256 _ticketPrice,
        uint256 _duration
    ) external onlyOwner {
        require(_tokenAddress != address(0), "Invalid token address");
        require(_burnAmount > 0, "Burn amount must be positive");
        require(_ticketPrice > 0, "Ticket price must be positive");
        require(_duration > 0, "Duration must be positive");
        
        // 检查该代币是否已有活跃轮次
        require(tokenActiveRound[_tokenAddress] == 0, "Token already has active round");
        
        totalRoundsCreated++;
        uint256 newRoundId = totalRoundsCreated;
        
        Round storage newRound = rounds[newRoundId];
        newRound.roundId = newRoundId;
        newRound.tokenAddress = _tokenAddress;
        newRound.burnAmount = _burnAmount;
        newRound.ticketPrice = _ticketPrice;
        newRound.startTime = block.timestamp;
        newRound.endTime = block.timestamp + _duration;
        newRound.isActive = true;
        
        // 继承该代币的储备金
        newRound.inheritedReserve = tokenReservePools[_tokenAddress];
        tokenReservePools[_tokenAddress] = 0;  // 清空储备池
        
        // 缓存代币信息
        (newRound.tokenName, newRound.tokenSymbol) = getTokenInfo(_tokenAddress);
        
        // 设置为该代币的活跃轮次
        tokenActiveRound[_tokenAddress] = newRoundId;
        tokenRoundCounts[_tokenAddress]++;
        
        // 初始化数字池 1-20
        for (uint256 i = 1; i <= MAX_PLAYERS; i++) {
            newRound.availableNumbers.push(i);
        }
        
        // 添加到活跃轮次列表
        activeRounds.push(newRoundId);
        
        emit RoundStarted(newRoundId, _tokenAddress, _burnAmount, _ticketPrice, newRound.endTime);
    }
    
    /**
     * @notice 参与指定轮次的游戏
     */
    function joinRound(uint256 _roundId) external payable {
        Round storage round = rounds[_roundId];
        
        require(round.isActive, "Round not active");
        require(!round.isSettled, "Round already settled");
        require(block.timestamp < round.endTime, "Round ended");
        require(round.participants.length < MAX_PLAYERS, "Round full");
        require(round.playerNumbers[msg.sender] == 0, "Already participated");
        require(msg.value >= round.ticketPrice, "Insufficient BNB");
        
        // 检查玩家是否在其他活跃轮次中
        // （可选：如果想限制玩家同时只能参与一轮）
        // require(playerActiveRounds[msg.sender].length == 0, "Already in another round");
        
        // 燃烧代币
        IERC20 token = IERC20(round.tokenAddress);
        require(
            token.transferFrom(msg.sender, DEAD_ADDRESS, round.burnAmount),
            "Token burn failed"
        );
        
        // 随机选择数字
        require(round.availableNumbers.length > 0, "No numbers available");
        uint256 randomIndex = _getRandomNumber(round.availableNumbers.length, _roundId);
        uint256 selectedNumber = round.availableNumbers[randomIndex];
        
        // 移除已选数字
        round.availableNumbers[randomIndex] = round.availableNumbers[round.availableNumbers.length - 1];
        round.availableNumbers.pop();
        
        // 记录玩家信息
        round.participants.push(msg.sender);
        round.playerNumbers[msg.sender] = selectedNumber;
        playerActiveRounds[msg.sender].push(_roundId);
        
        // 更新最大数字持有者
        if (selectedNumber > round.maxNumber) {
            round.maxNumber = selectedNumber;
            round.maxNumberHolder = msg.sender;
        }
        
        // 分配BNB
        uint256 potAmount = (msg.value * POT_SHARE) / 1000;         // 80% 本轮奖池
        uint256 devAmount = (msg.value * DEV_FEE) / 1000;           // 5% 开发费
        uint256 reserveAmount = (msg.value * NEXT_ROUND_RESERVE) / 1000; // 15% 储备金
        
        round.currentPot += potAmount;
        
        // 储备金流入该代币的储备池（用于下一场奖池）
        tokenReservePools[round.tokenAddress] += reserveAmount;
        
        // 发送开发费
        if (devAmount > 0) {
            payable(devWallet).transfer(devAmount);
        }
        
        emit PlayerJoined(_roundId, msg.sender, selectedNumber);
        
        // 检查是否满员，满员立即结算
        if (round.participants.length == MAX_PLAYERS) {
            _settleRound(_roundId);
        }
    }
    
    /**
     * @notice 结算指定轮次（只有赢家或管理员可以调用）
     */
    function settleRound(uint256 _roundId) external {
        Round storage round = rounds[_roundId];
        
        require(round.isActive, "Round not active");
        require(!round.isSettled, "Round already settled");
        require(
            round.participants.length == MAX_PLAYERS || block.timestamp >= round.endTime,
            "Round not ready for settlement"
        );
        
        // 权限检查：只有赢家或管理员可以结算
        require(
            msg.sender == round.maxNumberHolder || msg.sender == owner,
            "Only winner or admin can settle"
        );
        
        _settleRound(_roundId);
        
        // 不再给结算者奖励，奖励直接给赢家
    }
    
    function _settleRound(uint256 _roundId) internal {
        Round storage round = rounds[_roundId];
        round.isSettled = true;
        round.isActive = false;
        
        // 释放该代币的活跃位置
        tokenActiveRound[round.tokenAddress] = 0;
        
        // 从活跃列表移除
        _removeFromActiveRounds(_roundId);
        
        if (round.participants.length > 0 && round.maxNumberHolder != address(0)) {
            // 有参与者：计算总奖金并发放给赢家
            uint256 totalPrize = round.currentPot + round.inheritedReserve;
            
            payable(round.maxNumberHolder).transfer(totalPrize);
            
            emit RoundSettled(_roundId, round.maxNumberHolder, totalPrize);
        } else if (round.inheritedReserve > 0) {
            // 无人参与但有储备金：退回储备金给该代币的储备池
            tokenReservePools[round.tokenAddress] += round.inheritedReserve;
            
            emit RoundSettled(_roundId, address(0), 0);  // 无赢家，奖金为0
        }
        
        // 清理玩家的活跃轮次记录
        for (uint256 i = 0; i < round.participants.length; i++) {
            _removePlayerFromRound(round.participants[i], _roundId);
        }
    }
    
    // ============ 查询功能 ============
    
    /**
     * @notice 获取指定轮次基本信息
     */
    function getRoundInfo(uint256 _roundId) external view returns (
        uint256 roundId,
        address tokenAddress,
        uint256 burnAmount,
        uint256 ticketPrice,
        uint256 startTime,
        uint256 endTime,
        uint256 participantCount,
        uint256 currentPot,
        uint256 maxNumber,
        address maxNumberHolder,
        bool isSettled,
        bool isActive
    ) {
        Round storage round = rounds[_roundId];
        return (
            round.roundId,
            round.tokenAddress,
            round.burnAmount,
            round.ticketPrice,
            round.startTime,
            round.endTime,
            round.participants.length,
            round.currentPot,
            round.maxNumber,
            round.maxNumberHolder,
            round.isSettled,
            round.isActive
        );
    }
    
    /**
     * @notice 获取轮次扩展信息（储备金和代币信息）
     */
    function getRoundExtendedInfo(uint256 _roundId) external view returns (
        uint256 inheritedReserve,
        string memory tokenName,
        string memory tokenSymbol
    ) {
        Round storage round = rounds[_roundId];
        return (
            round.inheritedReserve,
            round.tokenName,
            round.tokenSymbol
        );
    }
    
    /**
     * @notice 获取所有活跃轮次
     */
    function getActiveRounds() external view returns (uint256[] memory) {
        return activeRounds;
    }
    
    /**
     * @notice 获取需要结算的轮次（已结束但未结算）
     */
    function getPendingSettlementRounds() external view returns (uint256[] memory) {
        uint256[] memory pendingRounds = new uint256[](activeRounds.length);
        uint256 count = 0;
        
        for (uint256 i = 0; i < activeRounds.length; i++) {
            uint256 roundId = activeRounds[i];
            Round storage round = rounds[roundId];
            
            if (round.isActive && 
                !round.isSettled && 
                block.timestamp >= round.endTime && 
                round.participants.length > 0) {
                pendingRounds[count] = roundId;
                count++;
            }
        }
        
        // 调整数组大小
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = pendingRounds[i];
        }
        
        return result;
    }
    
    /**
     * @notice 获取玩家在指定轮次的数字
     */
    function getPlayerNumber(uint256 _roundId, address _player) external view returns (uint256) {
        return rounds[_roundId].playerNumbers[_player];
    }
    
    /**
     * @notice 获取玩家参与的所有活跃轮次
     */
    function getPlayerActiveRounds(address _player) external view returns (uint256[] memory) {
        return playerActiveRounds[_player];
    }
    
    // ============ 辅助函数 ============
    
    function _getRandomNumber(uint256 _max, uint256 _roundId) internal view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.difficulty,
            msg.sender,
            _roundId,
            _max
        ))) % _max;
    }
    
    function _removeFromActiveRounds(uint256 _roundId) internal {
        for (uint256 i = 0; i < activeRounds.length; i++) {
            if (activeRounds[i] == _roundId) {
                activeRounds[i] = activeRounds[activeRounds.length - 1];
                activeRounds.pop();
                break;
            }
        }
    }
    
    function _removePlayerFromRound(address _player, uint256 _roundId) internal {
        uint256[] storage playerRounds = playerActiveRounds[_player];
        for (uint256 i = 0; i < playerRounds.length; i++) {
            if (playerRounds[i] == _roundId) {
                playerRounds[i] = playerRounds[playerRounds.length - 1];
                playerRounds.pop();
                break;
            }
        }
    }
    
    // ============ 应急功能 ============
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        payable(owner).transfer(balance);
        emit EmergencyWithdraw(owner, balance);
    }
    
    function updateDevWallet(address _newDevWallet) external onlyOwner {
        require(_newDevWallet != address(0), "Invalid address");
        devWallet = _newDevWallet;
    }
    
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid address");
        owner = _newOwner;
    }
}
