export const translations = {
    en: {
        nav: {
            home: 'HOME',
            game: 'GAME',
            swap: 'SWAP',
            rewards: 'REWARDS',
            connect: 'CONNECT_WALLET',
            connected: 'CONNECTED',
            system_online: 'SYSTEM_ONLINE',
            title: 'BNB INCINERATOR'
        },
        home: {
            hero_title: 'BNB INCINERATOR',
            hero_subtitle: 'Universal Incinerator',
            hero_edition: 'High Roller Edition v2.0',
            hero_desc_title: 'On-Chain Burn · Digital Betting · Winner Takes All',
            hero_desc: 'A revolutionary on-chain gaming platform combining "Token Deflationary Burn" with "PvP Card Flipping". Limited seats ensure fast rounds and high-frequency excitement!',
            start_playing: 'Start Playing',
            bsc_testnet: 'BSC Testnet',
            features: {
                limited: {
                    title: 'Limited Seats',
                    desc: 'Max 20 spots per round, ensuring fast settlement'
                },
                unique: {
                    title: 'Unique Numbers',
                    desc: 'Random 1-20 allocation, highest number wins'
                },
                winner: {
                    title: 'Winner Takes All',
                    desc: 'The winner takes the entire BNB pot'
                },
                burn: {
                    title: 'Burn Mechanism',
                    desc: 'Fuel tokens are burned directly, driving deflation'
                }
            },
            economics: {
                title: 'Dual Token Economy',
                desc: 'Innovative hybrid token mechanism for perfect balance of burn and reward',
                fuel: {
                    title: 'Fuel Token',
                    desc: 'Fuel Token',
                    list: [
                        'Different tokens per round (e.g. DOGE, PEPE)',
                        '100% burned to black hole address',
                        'Driving ecosystem deflation'
                    ]
                },
                settlement: {
                    title: 'Settlement Token',
                    desc: 'Settlement Token',
                    list: [
                        'Fixed use of BNB',
                        '80% to Prize Pot, 15% to Reserve for next round',
                        '5% Developer Fee'
                    ]
                }
            },
            flow: {
                title: 'Game Flow',
                desc: 'Simple 4 steps, fast participation, instant settlement',
                step1: { title: 'Start Round', desc: 'Admin sets fuel token and duration' },
                step2: { title: 'Flip Card', desc: 'Pay BNB + Token, get random number' },
                step3: { title: 'Trigger Settlement', desc: 'Auto-settle on full or timeout' },
                step4: { title: 'Winner Reward', desc: 'Highest number takes the pot' }
            },
            distribution: {
                title: 'Fund Distribution',
                entry_fee: { title: 'Entry Fee', desc: 'BNB Ticket + Token Fuel' },
                pot: { title: 'Prize Pot', desc: 'Winner takes all', value: '80%' },
                reserve: { title: 'Reserve Fund', desc: 'Seed for next round', value: '15%' },
                dev: { title: 'Dev Fee', desc: 'Maintenance & Growth', value: '5%' },
                note: 'Smart Distribution: Fees are automatically split to ensure sustainability and fairness'
            }
        },
        game: {
            title: 'Digital Betting Game',
            subtitle: 'Multi-round · Token Burn · Fair Random',
            connect_wallet: 'Connect MetaMask',
            admin_mode: 'Admin Console',
            owner_mode: 'Owner Mode',
            game_mode: 'Game Mode',
            game_mode_desc: 'Select a round to play',
            connecting_contract: 'Connecting Smart Contract',
            setup_contract: 'Setup Contract Address',
            default_contract: 'Default Contract Configured',
            use_this: 'Use This Address',
            or_input: 'Or input other contract address...',
            set_contract_btn: 'Set Contract',
            loading: 'Processing, please wait...',
            owner_console: 'Owner Console',
            owner_desc: 'Access for contract deployer only · Create and manage rounds',
            fuel_token_addr: 'Fuel Token Address',
            quick_select: 'Quick Select:',
            burn_amount: 'Burn Amount',
            ticket_price: 'Ticket Price (BNB)',
            duration: 'Duration (Hours)',
            start_round: 'Start New Round',
            active_rounds: 'Active Rounds',
            no_active_rounds: 'No active rounds currently',
            round: 'Round',
            pot: 'Pot',
            participants: 'Players',
            time_left: 'Time Left',
            ended: 'Ended',
            join: 'Join Game',
            settle: 'Settle Round',
            my_number: 'My Number',
            max_number: 'Max Number',
            status: {
                active: 'Active',
                settled: 'Settled'
            },
            steps: {
                approve: 'Step 1/2: Approving Token...',
                join: 'Step 2/2: Joining Game...'
            },
            errors: {
                install_metamask: 'Please install MetaMask',
                connect_failed: 'Connection Failed',
                setup_failed: 'Setup Failed',
                invalid_addr: 'Invalid Address',
                already_joined: 'You have already joined this round'
            },
            success: {
                connected: 'Wallet Connected!',
                contract_set: 'Contract Connected!',
                round_started: 'New Round Started!',
                joined: 'Successfully Joined!',
                settled: 'Round Settled! Rewards Distributed'
            },
            hall: {
                title: 'Game Hall',
                desc: 'Select a round to start betting',
                total_rounds: 'Total Rounds',
                active: 'Active',
                no_games: 'No active games',
                admin_hint: 'Start a new round in admin console'
            },
            auto_connected: 'Auto-connected to contract successfully!',
            cleanup: {
                button: 'Cleanup Expired',
                processing: 'Cleaning expired rounds...',
                success_count: 'Successfully cleaned ${count} expired rounds!',
                success_none: 'No expired rounds found to clean',
                error: 'Cleanup failed: ${error}'
            },
            card: {
                prize_pool: 'PRIZE POOL',
                players: 'PLAYERS',
                time_left: 'TIME LEFT',
                ticket: 'TICKET',
                burn: 'BURN',
                tokens: 'TOKENS',
                enter_game: 'ENTER GAME',
                burning: 'BURNING',
                winner: 'WINNER',
                claim: 'CLAIM REWARD',
                settle: 'SETTLE ROUND',
                full: 'FULL CAPACITY',
                expired: 'EXPIRED',
                joined: 'JOINED SUCCESSFULLY',
                your_number: 'YOUR NUMBER',
                status: {
                    run: 'RUN',
                    end: 'END',
                    waiting: 'WAITING FOR SETTLEMENT'
                }
            }
        }
    },
    zh: {
        nav: {
            home: '首页',
            game: '游戏',
            swap: '兑换',
            rewards: '奖励',
            connect: '连接钱包',
            connected: '已连接',
            system_online: '系统在线',
            title: 'BNB 焚化炉'
        },
        home: {
            hero_title: 'BNB 焚化炉',
            hero_subtitle: '通用焚化炉',
            hero_edition: '至尊版 v2.0',
            hero_desc_title: '链上销毁 · 数字竞猜 · 赢家通吃',
            hero_desc: '结合"代币通缩销毁"与"PvP翻牌比大小"的革命性链上博弈平台。采用限量座位机制，确保每轮游戏快速结算，高频刺激！',
            start_playing: '进入游戏',
            bsc_testnet: 'BSC 测试网',
            features: {
                limited: {
                    title: '限量参与',
                    desc: '每轮最多20个名额，确保快速结算'
                },
                unique: {
                    title: '唯一数字',
                    desc: '随机分配1-20号码，最大数字获胜'
                },
                winner: {
                    title: '赢家通吃',
                    desc: '获胜者独享全部BNB奖池'
                },
                burn: {
                    title: '销毁机制',
                    desc: '燃料代币直接销毁，推动通缩'
                }
            },
            economics: {
                title: '双代币经济模型',
                desc: '创新的混合代币机制，实现销毁和奖励的完美平衡',
                fuel: {
                    title: '燃料代币',
                    desc: 'Fuel Token',
                    list: [
                        '每轮指定不同代币（如 DOGE、PEPE）',
                        '100% 销毁到黑洞地址',
                        '推动代币生态通缩'
                    ]
                },
                settlement: {
                    title: '结算代币',
                    desc: 'Settlement Token',
                    list: [
                        '固定使用 BNB',
                        '80% 进入奖池，15% 储备金进入下一轮奖池',
                        '5% 开发者手续费'
                    ]
                }
            },
            flow: {
                title: '游戏流程',
                desc: '简单四步，快速参与，即时结算',
                step1: { title: '开启轮次', desc: '管理员设置燃料代币和倒计时' },
                step2: { title: '玩家翻牌', desc: '支付BNB+代币，随机获得数字' },
                step3: { title: '触发结算', desc: '满员或超时自动结算' },
                step4: { title: '赢家获奖', desc: '最大数字者获得全部奖池' }
            },
            distribution: {
                title: '资金分配机制',
                entry_fee: { title: '单次入场费用', desc: 'BNB门票 + 指定代币燃料' },
                pot: { title: '奖池基金', desc: '获胜者独享全部奖励', value: '80%' },
                reserve: { title: '储备基金', desc: '下轮游戏启动资金', value: '15%' },
                dev: { title: '开发费用', desc: '平台维护与发展', value: '5%' },
                note: '智能分配: 每次参与费用自动按比例分配，确保游戏可持续性和公平性'
            }
        },
        game: {
            title: '数字竞猜游戏',
            subtitle: '多轮同时进行 · 代币燃烧机制 · 公平随机',
            connect_wallet: '连接 MetaMask',
            admin_mode: '管理员控制台',
            owner_mode: '合约所有者模式',
            game_mode: '游戏模式',
            game_mode_desc: '选择轮次参与竞猜',
            connecting_contract: '正在连接智能合约',
            setup_contract: '设置合约地址',
            default_contract: '已配置默认合约地址',
            use_this: '使用此地址',
            or_input: '或输入其他合约地址...',
            set_contract_btn: '设置合约',
            loading: '处理中，请稍候...',
            owner_console: '合约所有者控制台',
            owner_desc: '仅合约部署者可访问 · 创建和管理游戏轮次',
            fuel_token_addr: '燃料代币地址',
            quick_select: '快捷选择:',
            burn_amount: '销毁数量',
            ticket_price: '门票价格 (BNB)',
            duration: '持续时间 (小时)',
            start_round: '开启新轮次',
            active_rounds: '活跃轮次',
            no_active_rounds: '当前暂无活跃轮次',
            round: '轮次',
            pot: '奖池',
            participants: '参与人数',
            time_left: '剩余时间',
            ended: '已结束',
            join: '加入游戏',
            settle: '结算轮次',
            my_number: '我的号码',
            max_number: '最大号码',
            status: {
                active: '进行中',
                settled: '已结算'
            },
            steps: {
                approve: '步骤1/2: 正在授权代币...',
                join: '步骤2/2: 正在加入游戏...'
            },
            errors: {
                install_metamask: '请安装 MetaMask 钱包',
                connect_failed: '连接失败',
                setup_failed: '设置合约失败',
                invalid_addr: '合约地址格式不正确',
                already_joined: '您已经参与了这个轮次'
            },
            success: {
                connected: '钱包连接成功！',
                contract_set: '合约连接成功！',
                round_started: '新一轮游戏已开启！',
                joined: '成功加入游戏！',
                settled: '轮次结算成功！奖励已发放'
            },
            hall: {
                title: '游戏大厅',
                desc: '选择轮次开始竞猜',
                total_rounds: '总轮次',
                active: '活跃中',
                no_games: '暂无活跃游戏',
                admin_hint: '在管理员控制台开启新轮次'
            },
            auto_connected: '自动连接合约成功！',
            cleanup: {
                button: '清理过期轮次',
                processing: '正在清理过期轮次...',
                success_count: '成功清理了 ${count} 个过期轮次！',
                success_none: '没有发现需要清理的过期轮次',
                error: '清理失败: ${error}'
            },
            card: {
                prize_pool: '奖池',
                players: '玩家',
                time_left: '剩余时间',
                ticket: '门票',
                burn: '销毁',
                tokens: '代币',
                enter_game: '进入游戏',
                burning: '燃烧中',
                winner: '赢家',
                claim: '领取奖励',
                settle: '结算轮次',
                full: '人数已满',
                expired: '已过期',
                joined: '已加入',
                your_number: '您的号码',
                status: {
                    run: '进行中',
                    end: '结束',
                    waiting: '等待结算'
                }
            }
        }
    }
};
