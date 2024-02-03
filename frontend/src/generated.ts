import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Board
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const boardAbi = [
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'boardSize',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      {
        name: 'a',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'b',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'getDistance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'tankA', internalType: 'uint256', type: 'uint256' },
      {
        name: 'b',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'getDistanceTankToPoint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'tankA', internalType: 'uint256', type: 'uint256' },
      { name: 'tankB', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getDistanceTanks',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'seed', internalType: 'uint256', type: 'uint256' }],
    name: 'getEmptyTile',
    outputs: [
      {
        name: '',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      {
        name: 'point',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'getHeartAtPosition',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'radius', internalType: 'uint256', type: 'uint256' }],
    name: 'getPerimeterForRadius',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tankId', internalType: 'uint256', type: 'uint256' }],
    name: 'getTankPosition',
    outputs: [
      {
        name: '',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      {
        name: 'point',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'getTile',
    outputs: [
      {
        name: '',
        internalType: 'struct Board.Tile',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          { name: 'hearts', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getTotalTiles',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      {
        name: 'point',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'isValidPoint',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      {
        name: 'point',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'pointToIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'seed', internalType: 'uint256', type: 'uint256' }],
    name: 'randomPoint',
    outputs: [
      {
        name: '',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'point',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'tile',
        internalType: 'struct Board.Tile',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          { name: 'hearts', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'setTile',
    outputs: [],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Bounty
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const bountyAbi = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_tankGame', internalType: 'address', type: 'address' },
      { name: '_tankGameView', internalType: 'address', type: 'address' },
      { name: '_ownerTank', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.ClaimParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          { name: 'claimer', internalType: 'address', type: 'address' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterClaim',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.DelegateParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          { name: 'delegatee', internalType: 'address', type: 'address' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterDelegate',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.DripParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterDrip',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.GiveParams',
        type: 'tuple',
        components: [
          { name: 'fromId', internalType: 'uint256', type: 'uint256' },
          { name: 'toId', internalType: 'uint256', type: 'uint256' },
          { name: 'hearts', internalType: 'uint256', type: 'uint256' },
          { name: 'aps', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterGive',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.JoinParams',
        type: 'tuple',
        components: [
          { name: 'joiner', internalType: 'address', type: 'address' },
          { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
          { name: 'playerName', internalType: 'string', type: 'string' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterJoin',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.MoveParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'to',
            internalType: 'struct Board.Point',
            type: 'tuple',
            components: [
              { name: 'x', internalType: 'uint256', type: 'uint256' },
              { name: 'y', internalType: 'uint256', type: 'uint256' },
              { name: 'z', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterMove',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterReveal',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: 'shootParams',
        internalType: 'struct ITankGame.ShootParams',
        type: 'tuple',
        components: [
          { name: 'fromId', internalType: 'uint256', type: 'uint256' },
          { name: 'toId', internalType: 'uint256', type: 'uint256' },
          { name: 'shots', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterShoot',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.UpgradeParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterUpgrade',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.VoteParams',
        type: 'tuple',
        components: [
          { name: 'voter', internalType: 'uint256', type: 'uint256' },
          { name: 'cursed', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterVote',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.ClaimParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          { name: 'claimer', internalType: 'address', type: 'address' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeClaim',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.DelegateParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          { name: 'delegatee', internalType: 'address', type: 'address' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeDelegate',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.DripParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeDrip',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.GiveParams',
        type: 'tuple',
        components: [
          { name: 'fromId', internalType: 'uint256', type: 'uint256' },
          { name: 'toId', internalType: 'uint256', type: 'uint256' },
          { name: 'hearts', internalType: 'uint256', type: 'uint256' },
          { name: 'aps', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeGive',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.JoinParams',
        type: 'tuple',
        components: [
          { name: 'joiner', internalType: 'address', type: 'address' },
          { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
          { name: 'playerName', internalType: 'string', type: 'string' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeJoin',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.MoveParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'to',
            internalType: 'struct Board.Point',
            type: 'tuple',
            components: [
              { name: 'x', internalType: 'uint256', type: 'uint256' },
              { name: 'y', internalType: 'uint256', type: 'uint256' },
              { name: 'z', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeMove',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeReveal',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.ShootParams',
        type: 'tuple',
        components: [
          { name: 'fromId', internalType: 'uint256', type: 'uint256' },
          { name: 'toId', internalType: 'uint256', type: 'uint256' },
          { name: 'shots', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeShoot',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.UpgradeParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeUpgrade',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.VoteParams',
        type: 'tuple',
        components: [
          { name: 'voter', internalType: 'uint256', type: 'uint256' },
          { name: 'cursed', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeVote',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tankId', internalType: 'uint256', type: 'uint256' }],
    name: 'bounties',
    outputs: [{ name: 'bountyId', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'bountyId', internalType: 'uint256', type: 'uint256' }],
    name: 'bountiesData',
    outputs: [
      { name: 'targetTankId', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'closed', internalType: 'bool', type: 'bool' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'bountyCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'bountyId', internalType: 'uint256', type: 'uint256' }],
    name: 'cancel',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'targetTankId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'create',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'ownerTank',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'tankGame',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'tankGameView',
    outputs: [
      { name: '', internalType: 'contract IGameView', type: 'address' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
      { name: 'reciever', internalType: 'address', type: 'address' },
    ],
    name: 'withdraw',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tankId', internalType: 'uint256', type: 'uint256' }],
    name: 'withdrawals',
    outputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'ownerTank',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'tankGame',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'BountyHookCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'bountyId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'tankId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'target',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BountyPosted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'bountyId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'winner',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'victim',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BountyWon',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tankId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'reciever',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Withdraw',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Clones
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const clonesAbi = [
  { type: 'error', inputs: [], name: 'ERC1167FailedCreateClone' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DefaultEmptyHooks
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const defaultEmptyHooksAbi = [
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.ClaimParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          { name: 'claimer', internalType: 'address', type: 'address' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterClaim',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.DelegateParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          { name: 'delegatee', internalType: 'address', type: 'address' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterDelegate',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.DripParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterDrip',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.GiveParams',
        type: 'tuple',
        components: [
          { name: 'fromId', internalType: 'uint256', type: 'uint256' },
          { name: 'toId', internalType: 'uint256', type: 'uint256' },
          { name: 'hearts', internalType: 'uint256', type: 'uint256' },
          { name: 'aps', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterGive',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.JoinParams',
        type: 'tuple',
        components: [
          { name: 'joiner', internalType: 'address', type: 'address' },
          { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
          { name: 'playerName', internalType: 'string', type: 'string' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterJoin',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.MoveParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'to',
            internalType: 'struct Board.Point',
            type: 'tuple',
            components: [
              { name: 'x', internalType: 'uint256', type: 'uint256' },
              { name: 'y', internalType: 'uint256', type: 'uint256' },
              { name: 'z', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterMove',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterReveal',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.ShootParams',
        type: 'tuple',
        components: [
          { name: 'fromId', internalType: 'uint256', type: 'uint256' },
          { name: 'toId', internalType: 'uint256', type: 'uint256' },
          { name: 'shots', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterShoot',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.UpgradeParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterUpgrade',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.VoteParams',
        type: 'tuple',
        components: [
          { name: 'voter', internalType: 'uint256', type: 'uint256' },
          { name: 'cursed', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterVote',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.ClaimParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          { name: 'claimer', internalType: 'address', type: 'address' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeClaim',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.DelegateParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          { name: 'delegatee', internalType: 'address', type: 'address' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeDelegate',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.DripParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeDrip',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.GiveParams',
        type: 'tuple',
        components: [
          { name: 'fromId', internalType: 'uint256', type: 'uint256' },
          { name: 'toId', internalType: 'uint256', type: 'uint256' },
          { name: 'hearts', internalType: 'uint256', type: 'uint256' },
          { name: 'aps', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeGive',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.JoinParams',
        type: 'tuple',
        components: [
          { name: 'joiner', internalType: 'address', type: 'address' },
          { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
          { name: 'playerName', internalType: 'string', type: 'string' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeJoin',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.MoveParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'to',
            internalType: 'struct Board.Point',
            type: 'tuple',
            components: [
              { name: 'x', internalType: 'uint256', type: 'uint256' },
              { name: 'y', internalType: 'uint256', type: 'uint256' },
              { name: 'z', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeMove',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeReveal',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.ShootParams',
        type: 'tuple',
        components: [
          { name: 'fromId', internalType: 'uint256', type: 'uint256' },
          { name: 'toId', internalType: 'uint256', type: 'uint256' },
          { name: 'shots', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeShoot',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.UpgradeParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeUpgrade',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.VoteParams',
        type: 'tuple',
        components: [
          { name: 'voter', internalType: 'uint256', type: 'uint256' },
          { name: 'cursed', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeVote',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GameView
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xE19866944E2CD0FfaE4e35d168149b9B934eA471)
 * -
 */
export const gameViewAbi = [
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'game', internalType: 'address', type: 'address' }],
    name: 'getAllHearts',
    outputs: [
      {
        name: '',
        internalType: 'struct IGameView.HeartLocation[]',
        type: 'tuple[]',
        components: [
          {
            name: 'position',
            internalType: 'struct Board.Point',
            type: 'tuple',
            components: [
              { name: 'x', internalType: 'uint256', type: 'uint256' },
              { name: 'y', internalType: 'uint256', type: 'uint256' },
              { name: 'z', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'numHearts', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'game', internalType: 'address', type: 'address' }],
    name: 'getAllTanks',
    outputs: [
      {
        name: '',
        internalType: 'struct IGameView.TankLocation[]',
        type: 'tuple[]',
        components: [
          {
            name: 'tank',
            internalType: 'struct ITankGame.Tank',
            type: 'tuple',
            components: [
              { name: 'owner', internalType: 'address', type: 'address' },
              { name: 'hearts', internalType: 'uint256', type: 'uint256' },
              { name: 'aps', internalType: 'uint256', type: 'uint256' },
              { name: 'range', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'position',
            internalType: 'struct Board.Point',
            type: 'tuple',
            components: [
              { name: 'x', internalType: 'uint256', type: 'uint256' },
              { name: 'y', internalType: 'uint256', type: 'uint256' },
              { name: 'z', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'gameAddress', internalType: 'address', type: 'address' }],
    name: 'getBoard',
    outputs: [{ name: '', internalType: 'contract Board', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'gameAddress', internalType: 'address', type: 'address' }],
    name: 'getEpoch',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'gameAddress', internalType: 'address', type: 'address' }],
    name: 'getGameEpoch',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'gameAddress', internalType: 'address', type: 'address' },
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getLastDrip',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'gameAddress', internalType: 'address', type: 'address' }],
    name: 'getPlayerCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'gameAddress', internalType: 'address', type: 'address' }],
    name: 'getSettings',
    outputs: [
      {
        name: '',
        internalType: 'struct ITankGame.GameSettings',
        type: 'tuple',
        components: [
          { name: 'playerCount', internalType: 'uint256', type: 'uint256' },
          { name: 'boardSize', internalType: 'uint256', type: 'uint256' },
          { name: 'initAPs', internalType: 'uint256', type: 'uint256' },
          { name: 'initHearts', internalType: 'uint256', type: 'uint256' },
          { name: 'initShootRange', internalType: 'uint256', type: 'uint256' },
          { name: 'epochSeconds', internalType: 'uint256', type: 'uint256' },
          { name: 'buyInMinimum', internalType: 'uint256', type: 'uint256' },
          {
            name: 'revealWaitBlocks',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'autoStart', internalType: 'bool', type: 'bool' },
          { name: 'root', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'gameAddress', internalType: 'address', type: 'address' }],
    name: 'getState',
    outputs: [
      { name: '', internalType: 'enum ITankGame.GameState', type: 'uint8' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'gameAddress', internalType: 'address', type: 'address' },
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getTank',
    outputs: [
      {
        name: '',
        internalType: 'struct ITankGame.Tank',
        type: 'tuple',
        components: [
          { name: 'owner', internalType: 'address', type: 'address' },
          { name: 'hearts', internalType: 'uint256', type: 'uint256' },
          { name: 'aps', internalType: 'uint256', type: 'uint256' },
          { name: 'range', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'gameAddress', internalType: 'address', type: 'address' },
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getUpgradeCost',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'gameAddress', internalType: 'address', type: 'address' },
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
      { name: '_owner', internalType: 'address', type: 'address' },
    ],
    name: 'isAuth',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
] as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xE19866944E2CD0FfaE4e35d168149b9B934eA471)
 * -
 */
export const gameViewAddress = {
  5: '0xE19866944E2CD0FfaE4e35d168149b9B934eA471',
  31337: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
} as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xE19866944E2CD0FfaE4e35d168149b9B934eA471)
 * -
 */
export const gameViewConfig = {
  address: gameViewAddress,
  abi: gameViewAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// HexBoard
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const hexBoardAbi = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [{ name: '_boardSize', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'boardSize',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      {
        name: 'a',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'b',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'getDistance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'tankA', internalType: 'uint256', type: 'uint256' },
      {
        name: 'b',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'getDistanceTankToPoint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'tankA', internalType: 'uint256', type: 'uint256' },
      { name: 'tankB', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getDistanceTanks',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'seed', internalType: 'uint256', type: 'uint256' }],
    name: 'getEmptyTile',
    outputs: [
      {
        name: '',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      {
        name: 'point',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'getHeartAtPosition',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [{ name: 'radius', internalType: 'uint256', type: 'uint256' }],
    name: 'getPerimeterForRadius',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tankId', internalType: 'uint256', type: 'uint256' }],
    name: 'getTankPosition',
    outputs: [
      {
        name: '',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      {
        name: 'point',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'getTile',
    outputs: [
      {
        name: '',
        internalType: 'struct Board.Tile',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          { name: 'hearts', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getTotalTiles',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'position', internalType: 'uint256', type: 'uint256' }],
    name: 'heartsOnBoard',
    outputs: [{ name: 'heartCount', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      {
        name: 'point',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'isValidPoint',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      {
        name: 'point',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'pointToIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'seed', internalType: 'uint256', type: 'uint256' }],
    name: 'randomPoint',
    outputs: [
      {
        name: '',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'point',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'tile',
        internalType: 'struct Board.Tile',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          { name: 'hearts', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'setTile',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tankId', internalType: 'uint256', type: 'uint256' }],
    name: 'tankToPosition',
    outputs: [
      { name: 'x', internalType: 'uint256', type: 'uint256' },
      { name: 'y', internalType: 'uint256', type: 'uint256' },
      { name: 'z', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'position', internalType: 'uint256', type: 'uint256' }],
    name: 'tanksOnBoard',
    outputs: [{ name: 'tankId', internalType: 'uint256', type: 'uint256' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// HookFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2833Ee23DdAFa959D5ca459c6A64df2164B367b3)
 * -
 */
export const hookFactoryAbi = [
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tankGame', internalType: 'contract ITankGame', type: 'address' },
      { name: 'gameView', internalType: 'contract IGameView', type: 'address' },
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'hookType',
        internalType: 'enum HookFactory.HookRegistry',
        type: 'uint8',
      },
    ],
    name: 'createHook',
    outputs: [{ name: '', internalType: 'contract IHooks', type: 'address' }],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tankGame',
        internalType: 'contract ITankGame',
        type: 'address',
        indexed: true,
      },
      {
        name: '_type',
        internalType: 'enum HookFactory.HookRegistry',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'hookAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'tankId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'creator',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'HookCreated',
  },
] as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2833Ee23DdAFa959D5ca459c6A64df2164B367b3)
 * -
 */
export const hookFactoryAddress = {
  5: '0x2833Ee23DdAFa959D5ca459c6A64df2164B367b3',
  31337: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
} as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2833Ee23DdAFa959D5ca459c6A64df2164B367b3)
 * -
 */
export const hookFactoryConfig = {
  address: hookFactoryAddress,
  abi: hookFactoryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IGameView
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iGameViewAbi = [
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'game', internalType: 'address', type: 'address' }],
    name: 'getAllHearts',
    outputs: [
      {
        name: '',
        internalType: 'struct IGameView.HeartLocation[]',
        type: 'tuple[]',
        components: [
          {
            name: 'position',
            internalType: 'struct Board.Point',
            type: 'tuple',
            components: [
              { name: 'x', internalType: 'uint256', type: 'uint256' },
              { name: 'y', internalType: 'uint256', type: 'uint256' },
              { name: 'z', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'numHearts', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'game', internalType: 'address', type: 'address' }],
    name: 'getAllTanks',
    outputs: [
      {
        name: '',
        internalType: 'struct IGameView.TankLocation[]',
        type: 'tuple[]',
        components: [
          {
            name: 'tank',
            internalType: 'struct ITankGame.Tank',
            type: 'tuple',
            components: [
              { name: 'owner', internalType: 'address', type: 'address' },
              { name: 'hearts', internalType: 'uint256', type: 'uint256' },
              { name: 'aps', internalType: 'uint256', type: 'uint256' },
              { name: 'range', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'position',
            internalType: 'struct Board.Point',
            type: 'tuple',
            components: [
              { name: 'x', internalType: 'uint256', type: 'uint256' },
              { name: 'y', internalType: 'uint256', type: 'uint256' },
              { name: 'z', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'game', internalType: 'address', type: 'address' }],
    name: 'getBoard',
    outputs: [{ name: '', internalType: 'contract Board', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'game', internalType: 'address', type: 'address' }],
    name: 'getEpoch',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'game', internalType: 'address', type: 'address' }],
    name: 'getGameEpoch',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'game', internalType: 'address', type: 'address' },
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getLastDrip',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'game', internalType: 'address', type: 'address' }],
    name: 'getPlayerCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'game', internalType: 'address', type: 'address' }],
    name: 'getSettings',
    outputs: [
      {
        name: '',
        internalType: 'struct ITankGame.GameSettings',
        type: 'tuple',
        components: [
          { name: 'playerCount', internalType: 'uint256', type: 'uint256' },
          { name: 'boardSize', internalType: 'uint256', type: 'uint256' },
          { name: 'initAPs', internalType: 'uint256', type: 'uint256' },
          { name: 'initHearts', internalType: 'uint256', type: 'uint256' },
          { name: 'initShootRange', internalType: 'uint256', type: 'uint256' },
          { name: 'epochSeconds', internalType: 'uint256', type: 'uint256' },
          { name: 'buyInMinimum', internalType: 'uint256', type: 'uint256' },
          {
            name: 'revealWaitBlocks',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'autoStart', internalType: 'bool', type: 'bool' },
          { name: 'root', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'game', internalType: 'address', type: 'address' }],
    name: 'getState',
    outputs: [
      { name: '', internalType: 'enum ITankGame.GameState', type: 'uint8' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'game', internalType: 'address', type: 'address' },
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getTank',
    outputs: [
      {
        name: '',
        internalType: 'struct ITankGame.Tank',
        type: 'tuple',
        components: [
          { name: 'owner', internalType: 'address', type: 'address' },
          { name: 'hearts', internalType: 'uint256', type: 'uint256' },
          { name: 'aps', internalType: 'uint256', type: 'uint256' },
          { name: 'range', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'game', internalType: 'address', type: 'address' },
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'isAuth',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IHooks
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iHooksAbi = [
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'gameId', internalType: 'address', type: 'address' },
      {
        name: 'claimParams',
        internalType: 'struct ITankGame.ClaimParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          { name: 'claimer', internalType: 'address', type: 'address' },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterClaim',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'gameId', internalType: 'address', type: 'address' },
      {
        name: 'delegateParams',
        internalType: 'struct ITankGame.DelegateParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          { name: 'delegatee', internalType: 'address', type: 'address' },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterDelegate',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'gameId', internalType: 'address', type: 'address' },
      {
        name: 'dripParams',
        internalType: 'struct ITankGame.DripParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterDrip',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'gameId', internalType: 'address', type: 'address' },
      {
        name: 'giveParams',
        internalType: 'struct ITankGame.GiveParams',
        type: 'tuple',
        components: [
          { name: 'fromId', internalType: 'uint256', type: 'uint256' },
          { name: 'toId', internalType: 'uint256', type: 'uint256' },
          { name: 'hearts', internalType: 'uint256', type: 'uint256' },
          { name: 'aps', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterGive',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'gameId', internalType: 'address', type: 'address' },
      {
        name: 'joinParams',
        internalType: 'struct ITankGame.JoinParams',
        type: 'tuple',
        components: [
          { name: 'joiner', internalType: 'address', type: 'address' },
          { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
          { name: 'playerName', internalType: 'string', type: 'string' },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterJoin',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'gameId', internalType: 'address', type: 'address' },
      {
        name: 'moveParams',
        internalType: 'struct ITankGame.MoveParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'to',
            internalType: 'struct Board.Point',
            type: 'tuple',
            components: [
              { name: 'x', internalType: 'uint256', type: 'uint256' },
              { name: 'y', internalType: 'uint256', type: 'uint256' },
              { name: 'z', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterMove',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'gameId', internalType: 'address', type: 'address' },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterReveal',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'gameId', internalType: 'address', type: 'address' },
      {
        name: 'shootParams',
        internalType: 'struct ITankGame.ShootParams',
        type: 'tuple',
        components: [
          { name: 'fromId', internalType: 'uint256', type: 'uint256' },
          { name: 'toId', internalType: 'uint256', type: 'uint256' },
          { name: 'shots', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterShoot',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'gameId', internalType: 'address', type: 'address' },
      {
        name: 'upgradeParams',
        internalType: 'struct ITankGame.UpgradeParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterUpgrade',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'gameId', internalType: 'address', type: 'address' },
      {
        name: 'voteParams',
        internalType: 'struct ITankGame.VoteParams',
        type: 'tuple',
        components: [
          { name: 'voter', internalType: 'uint256', type: 'uint256' },
          { name: 'cursed', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterVote',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'gameId', internalType: 'address', type: 'address' },
      {
        name: 'claimParams',
        internalType: 'struct ITankGame.ClaimParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          { name: 'claimer', internalType: 'address', type: 'address' },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeClaim',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'gameId', internalType: 'address', type: 'address' },
      {
        name: 'delegateParams',
        internalType: 'struct ITankGame.DelegateParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          { name: 'delegatee', internalType: 'address', type: 'address' },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeDelegate',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'gameId', internalType: 'address', type: 'address' },
      {
        name: 'dripParams',
        internalType: 'struct ITankGame.DripParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeDrip',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'gameId', internalType: 'address', type: 'address' },
      {
        name: 'giveParams',
        internalType: 'struct ITankGame.GiveParams',
        type: 'tuple',
        components: [
          { name: 'fromId', internalType: 'uint256', type: 'uint256' },
          { name: 'toId', internalType: 'uint256', type: 'uint256' },
          { name: 'hearts', internalType: 'uint256', type: 'uint256' },
          { name: 'aps', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeGive',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'gameId', internalType: 'address', type: 'address' },
      {
        name: 'joinParams',
        internalType: 'struct ITankGame.JoinParams',
        type: 'tuple',
        components: [
          { name: 'joiner', internalType: 'address', type: 'address' },
          { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
          { name: 'playerName', internalType: 'string', type: 'string' },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeJoin',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'gameId', internalType: 'address', type: 'address' },
      {
        name: 'moveParams',
        internalType: 'struct ITankGame.MoveParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'to',
            internalType: 'struct Board.Point',
            type: 'tuple',
            components: [
              { name: 'x', internalType: 'uint256', type: 'uint256' },
              { name: 'y', internalType: 'uint256', type: 'uint256' },
              { name: 'z', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeMove',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'gameId', internalType: 'address', type: 'address' },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeReveal',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'gameId', internalType: 'address', type: 'address' },
      {
        name: 'shootParams',
        internalType: 'struct ITankGame.ShootParams',
        type: 'tuple',
        components: [
          { name: 'fromId', internalType: 'uint256', type: 'uint256' },
          { name: 'toId', internalType: 'uint256', type: 'uint256' },
          { name: 'shots', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeShoot',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'gameId', internalType: 'address', type: 'address' },
      {
        name: 'upgradeParams',
        internalType: 'struct ITankGame.UpgradeParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeUpgrade',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'gameId', internalType: 'address', type: 'address' },
      {
        name: 'voteParams',
        internalType: 'struct ITankGame.VoteParams',
        type: 'tuple',
        components: [
          { name: 'voter', internalType: 'uint256', type: 'uint256' },
          { name: 'cursed', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeVote',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IMulticall3
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iMulticall3Abi = [
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'aggregate',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'returnData', internalType: 'bytes[]', type: 'bytes[]' },
    ],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call3[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'allowFailure', internalType: 'bool', type: 'bool' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'aggregate3',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call3Value[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'allowFailure', internalType: 'bool', type: 'bool' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'aggregate3Value',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'blockAndAggregate',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'blockHash', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getBasefee',
    outputs: [{ name: 'basefee', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'blockNumber', internalType: 'uint256', type: 'uint256' }],
    name: 'getBlockHash',
    outputs: [{ name: 'blockHash', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getBlockNumber',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getChainId',
    outputs: [{ name: 'chainid', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockCoinbase',
    outputs: [{ name: 'coinbase', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockDifficulty',
    outputs: [{ name: 'difficulty', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockGasLimit',
    outputs: [{ name: 'gaslimit', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockTimestamp',
    outputs: [{ name: 'timestamp', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'getEthBalance',
    outputs: [{ name: 'balance', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getLastBlockHash',
    outputs: [{ name: 'blockHash', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'requireSuccess', internalType: 'bool', type: 'bool' },
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'tryAggregate',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'requireSuccess', internalType: 'bool', type: 'bool' },
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'tryBlockAndAggregate',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'blockHash', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ITankGame
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const iTankGameAbi = [
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
      { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
    ],
    name: 'addHooks',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'claimParams',
        internalType: 'struct ITankGame.ClaimParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          { name: 'claimer', internalType: 'address', type: 'address' },
        ],
      },
    ],
    name: 'claim',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'delegateParams',
        internalType: 'struct ITankGame.DelegateParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          { name: 'delegatee', internalType: 'address', type: 'address' },
        ],
      },
    ],
    name: 'delegate',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'dripParams',
        internalType: 'struct ITankGame.DripParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'drip',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
      { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
    ],
    name: 'forceAddDefaultHook',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'giveParams',
        internalType: 'struct ITankGame.GiveParams',
        type: 'tuple',
        components: [
          { name: 'fromId', internalType: 'uint256', type: 'uint256' },
          { name: 'toId', internalType: 'uint256', type: 'uint256' },
          { name: 'hearts', internalType: 'uint256', type: 'uint256' },
          { name: 'aps', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'give',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      {
        name: 'settings',
        internalType: 'struct ITankGame.GameSettings',
        type: 'tuple',
        components: [
          { name: 'playerCount', internalType: 'uint256', type: 'uint256' },
          { name: 'boardSize', internalType: 'uint256', type: 'uint256' },
          { name: 'initAPs', internalType: 'uint256', type: 'uint256' },
          { name: 'initHearts', internalType: 'uint256', type: 'uint256' },
          { name: 'initShootRange', internalType: 'uint256', type: 'uint256' },
          { name: 'epochSeconds', internalType: 'uint256', type: 'uint256' },
          { name: 'buyInMinimum', internalType: 'uint256', type: 'uint256' },
          {
            name: 'revealWaitBlocks',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'autoStart', internalType: 'bool', type: 'bool' },
          { name: 'root', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      { name: '_owner', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      {
        name: 'joinParams',
        internalType: 'struct ITankGame.JoinParams',
        type: 'tuple',
        components: [
          { name: 'joiner', internalType: 'address', type: 'address' },
          { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
          { name: 'playerName', internalType: 'string', type: 'string' },
        ],
      },
    ],
    name: 'join',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'moveParams',
        internalType: 'struct ITankGame.MoveParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'to',
            internalType: 'struct Board.Point',
            type: 'tuple',
            components: [
              { name: 'x', internalType: 'uint256', type: 'uint256' },
              { name: 'y', internalType: 'uint256', type: 'uint256' },
              { name: 'z', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
    ],
    name: 'move',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'reveal',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'shootParams',
        internalType: 'struct ITankGame.ShootParams',
        type: 'tuple',
        components: [
          { name: 'fromId', internalType: 'uint256', type: 'uint256' },
          { name: 'toId', internalType: 'uint256', type: 'uint256' },
          { name: 'shots', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'shoot',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'upgradeParams',
        internalType: 'struct ITankGame.UpgradeParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'upgrade',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'voteParams',
        internalType: 'struct ITankGame.VoteParams',
        type: 'tuple',
        components: [
          { name: 'voter', internalType: 'uint256', type: 'uint256' },
          { name: 'cursed', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'vote',
    outputs: [],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'hunter',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'victim',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'reward',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BountyCompleted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'reciever',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'tankId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Claim',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'poker',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'blocknumber',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Commit',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'cursedTank',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'voter',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'epoch',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Curse',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'killer',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'killed',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Death',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tank',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Delegate',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tankId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'epoch',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Drip',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'settings',
        internalType: 'struct ITankGame.GameSettings',
        type: 'tuple',
        components: [
          { name: 'playerCount', internalType: 'uint256', type: 'uint256' },
          { name: 'boardSize', internalType: 'uint256', type: 'uint256' },
          { name: 'initAPs', internalType: 'uint256', type: 'uint256' },
          { name: 'initHearts', internalType: 'uint256', type: 'uint256' },
          { name: 'initShootRange', internalType: 'uint256', type: 'uint256' },
          { name: 'epochSeconds', internalType: 'uint256', type: 'uint256' },
          { name: 'buyInMinimum', internalType: 'uint256', type: 'uint256' },
          {
            name: 'revealWaitBlocks',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'autoStart', internalType: 'bool', type: 'bool' },
          { name: 'root', internalType: 'bytes32', type: 'bytes32' },
        ],
        indexed: false,
      },
    ],
    name: 'GameInit',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'winner',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'second',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'third',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'prizePool',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'GameOver',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'GameStarted' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'fromId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'toId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'hearts',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'aps', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Give',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tankId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'hook',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'HooksAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tankId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'position',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
        indexed: false,
      },
    ],
    name: 'Move',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'player',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'tankId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'position',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
        indexed: false,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'PlayerJoined',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'donator',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newTotal',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PrizeIncrease',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'poker',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'blocknumber',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Reveal',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'savior',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'saved',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Revive',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tankId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'targetId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Shoot',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'poker',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'position',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
        indexed: false,
      },
    ],
    name: 'SpawnHeart',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tankId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'range',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Upgrade',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'voter',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'cursed',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'epoch',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Vote',
  },
] as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const iTankGameAddress = {
  5: '0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414',
  31337: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
} as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const iTankGameConfig = {
  address: iTankGameAddress,
  abi: iTankGameAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ITreaty
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iTreatyAbi = [
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
      { name: 'hook', internalType: 'address', type: 'address' },
    ],
    name: 'accept',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'propose',
    outputs: [],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposer',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'proposee',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'hookProposer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'hookAccepter',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expiry',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'AcceptedTreaty',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposer',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'proposee',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'proposalHook',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expiry',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposedTreaty',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Math
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mathAbi = [
  { type: 'error', inputs: [], name: 'MathOverflowedMulDiv' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MerkleProof
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const merkleProofAbi = [
  { type: 'error', inputs: [], name: 'MerkleProofInvalidMultiproof' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NonAggression
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const nonAggressionAbi = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_tankGame', internalType: 'address', type: 'address' },
      { name: '_gameView', internalType: 'address', type: 'address' },
      { name: '_ownerTank', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
      { name: 'treaty', internalType: 'address', type: 'address' },
    ],
    name: 'accept',
    outputs: [],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.ClaimParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          { name: 'claimer', internalType: 'address', type: 'address' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterClaim',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.DelegateParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          { name: 'delegatee', internalType: 'address', type: 'address' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterDelegate',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.DripParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterDrip',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.GiveParams',
        type: 'tuple',
        components: [
          { name: 'fromId', internalType: 'uint256', type: 'uint256' },
          { name: 'toId', internalType: 'uint256', type: 'uint256' },
          { name: 'hearts', internalType: 'uint256', type: 'uint256' },
          { name: 'aps', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterGive',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.JoinParams',
        type: 'tuple',
        components: [
          { name: 'joiner', internalType: 'address', type: 'address' },
          { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
          { name: 'playerName', internalType: 'string', type: 'string' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterJoin',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.MoveParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'to',
            internalType: 'struct Board.Point',
            type: 'tuple',
            components: [
              { name: 'x', internalType: 'uint256', type: 'uint256' },
              { name: 'y', internalType: 'uint256', type: 'uint256' },
              { name: 'z', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterMove',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterReveal',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.ShootParams',
        type: 'tuple',
        components: [
          { name: 'fromId', internalType: 'uint256', type: 'uint256' },
          { name: 'toId', internalType: 'uint256', type: 'uint256' },
          { name: 'shots', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterShoot',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.UpgradeParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterUpgrade',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.VoteParams',
        type: 'tuple',
        components: [
          { name: 'voter', internalType: 'uint256', type: 'uint256' },
          { name: 'cursed', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterVote',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tankId', internalType: 'uint256', type: 'uint256' }],
    name: 'allies',
    outputs: [{ name: 'expiry', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.ClaimParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          { name: 'claimer', internalType: 'address', type: 'address' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeClaim',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.DelegateParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          { name: 'delegatee', internalType: 'address', type: 'address' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeDelegate',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.DripParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeDrip',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.GiveParams',
        type: 'tuple',
        components: [
          { name: 'fromId', internalType: 'uint256', type: 'uint256' },
          { name: 'toId', internalType: 'uint256', type: 'uint256' },
          { name: 'hearts', internalType: 'uint256', type: 'uint256' },
          { name: 'aps', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeGive',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.JoinParams',
        type: 'tuple',
        components: [
          { name: 'joiner', internalType: 'address', type: 'address' },
          { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
          { name: 'playerName', internalType: 'string', type: 'string' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeJoin',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.MoveParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'to',
            internalType: 'struct Board.Point',
            type: 'tuple',
            components: [
              { name: 'x', internalType: 'uint256', type: 'uint256' },
              { name: 'y', internalType: 'uint256', type: 'uint256' },
              { name: 'z', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeMove',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeReveal',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: 'shootParams',
        internalType: 'struct ITankGame.ShootParams',
        type: 'tuple',
        components: [
          { name: 'fromId', internalType: 'uint256', type: 'uint256' },
          { name: 'toId', internalType: 'uint256', type: 'uint256' },
          { name: 'shots', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeShoot',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.UpgradeParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeUpgrade',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'struct ITankGame.VoteParams',
        type: 'tuple',
        components: [
          { name: 'voter', internalType: 'uint256', type: 'uint256' },
          { name: 'cursed', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeVote',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'ownerTank',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tankId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposals',
    outputs: [{ name: 'expiry', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'propose',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'tankGame',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'tankGameView',
    outputs: [
      { name: '', internalType: 'contract IGameView', type: 'address' },
    ],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposer',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'proposee',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'hookProposer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'hookAccepter',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expiry',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'AcceptedTreaty',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'ownerTank',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'tankGame',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'NonAggressionCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposer',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'proposee',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'proposalHook',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expiry',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposedTreaty',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Strings
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const stringsAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'length', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'StringsInsufficientHexLength',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TankGame
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const tankGameAbi = [
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: '_getEpoch',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
      { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
    ],
    name: 'addHooks',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'aliveTanksIdSum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'board',
    outputs: [{ name: '', internalType: 'contract Board', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct ITankGame.ClaimParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          { name: 'claimer', internalType: 'address', type: 'address' },
        ],
      },
    ],
    name: 'claim',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tankId', internalType: 'uint256', type: 'uint256' }],
    name: 'claimed',
    outputs: [{ name: 'claimed', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'deadTanks',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct ITankGame.DelegateParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          { name: 'delegatee', internalType: 'address', type: 'address' },
        ],
      },
    ],
    name: 'delegate',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
      { name: 'delegate', internalType: 'address', type: 'address' },
    ],
    name: 'delegates',
    outputs: [{ name: 'isDelegate', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [],
    name: 'donate',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct ITankGame.DripParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'drip',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'epochStart',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'factory',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
      { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
    ],
    name: 'forceAddDefaultHook',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tankId', internalType: 'uint256', type: 'uint256' }],
    name: 'getLastDrip',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tankId', internalType: 'uint256', type: 'uint256' }],
    name: 'getUpgradeCost',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct ITankGame.GiveParams',
        type: 'tuple',
        components: [
          { name: 'fromId', internalType: 'uint256', type: 'uint256' },
          { name: 'toId', internalType: 'uint256', type: 'uint256' },
          { name: 'hearts', internalType: 'uint256', type: 'uint256' },
          { name: 'aps', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'give',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      {
        name: 'gs',
        internalType: 'struct ITankGame.GameSettings',
        type: 'tuple',
        components: [
          { name: 'playerCount', internalType: 'uint256', type: 'uint256' },
          { name: 'boardSize', internalType: 'uint256', type: 'uint256' },
          { name: 'initAPs', internalType: 'uint256', type: 'uint256' },
          { name: 'initHearts', internalType: 'uint256', type: 'uint256' },
          { name: 'initShootRange', internalType: 'uint256', type: 'uint256' },
          { name: 'epochSeconds', internalType: 'uint256', type: 'uint256' },
          { name: 'buyInMinimum', internalType: 'uint256', type: 'uint256' },
          {
            name: 'revealWaitBlocks',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'autoStart', internalType: 'bool', type: 'bool' },
          { name: 'root', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      { name: '_owner', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
      { name: '_owner', internalType: 'address', type: 'address' },
    ],
    name: 'isAuth',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct ITankGame.JoinParams',
        type: 'tuple',
        components: [
          { name: 'joiner', internalType: 'address', type: 'address' },
          { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
          { name: 'playerName', internalType: 'string', type: 'string' },
        ],
      },
    ],
    name: 'join',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tankId', internalType: 'uint256', type: 'uint256' }],
    name: 'lastDripEpoch',
    outputs: [{ name: 'epoch', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'lastRevealBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct ITankGame.MoveParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'to',
            internalType: 'struct Board.Point',
            type: 'tuple',
            components: [
              { name: 'x', internalType: 'uint256', type: 'uint256' },
              { name: 'y', internalType: 'uint256', type: 'uint256' },
              { name: 'z', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
    ],
    name: 'move',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'numTanksAlive',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'player', internalType: 'address', type: 'address' }],
    name: 'players',
    outputs: [{ name: 'tank', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'playersCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'podium',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'prizePool',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'reveal',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'revealBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_owner', internalType: 'address', type: 'address' }],
    name: 'setOwner',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'settings',
    outputs: [
      { name: 'playerCount', internalType: 'uint256', type: 'uint256' },
      { name: 'boardSize', internalType: 'uint256', type: 'uint256' },
      { name: 'initAPs', internalType: 'uint256', type: 'uint256' },
      { name: 'initHearts', internalType: 'uint256', type: 'uint256' },
      { name: 'initShootRange', internalType: 'uint256', type: 'uint256' },
      { name: 'epochSeconds', internalType: 'uint256', type: 'uint256' },
      { name: 'buyInMinimum', internalType: 'uint256', type: 'uint256' },
      { name: 'revealWaitBlocks', internalType: 'uint256', type: 'uint256' },
      { name: 'autoStart', internalType: 'bool', type: 'bool' },
      { name: 'root', internalType: 'bytes32', type: 'bytes32' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct ITankGame.ShootParams',
        type: 'tuple',
        components: [
          { name: 'fromId', internalType: 'uint256', type: 'uint256' },
          { name: 'toId', internalType: 'uint256', type: 'uint256' },
          { name: 'shots', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'shoot',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'start',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'state',
    outputs: [
      { name: '', internalType: 'enum ITankGame.GameState', type: 'uint8' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'stateData',
    outputs: [
      { name: 'playersCount', internalType: 'uint256', type: 'uint256' },
      { name: 'numTanksAlive', internalType: 'uint256', type: 'uint256' },
      { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
      { name: 'epochStart', internalType: 'uint256', type: 'uint256' },
      { name: 'aliveTanksIdSum', internalType: 'uint256', type: 'uint256' },
      { name: 'revealBlock', internalType: 'uint256', type: 'uint256' },
      { name: 'lastRevealBlock', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'tankHooks',
    outputs: [
      { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tankId', internalType: 'uint256', type: 'uint256' }],
    name: 'tanks',
    outputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'hearts', internalType: 'uint256', type: 'uint256' },
      { name: 'aps', internalType: 'uint256', type: 'uint256' },
      { name: 'range', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct ITankGame.UpgradeParams',
        type: 'tuple',
        components: [
          { name: 'tankId', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'upgrade',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct ITankGame.VoteParams',
        type: 'tuple',
        components: [
          { name: 'voter', internalType: 'uint256', type: 'uint256' },
          { name: 'cursed', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'vote',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'epoch', internalType: 'uint256', type: 'uint256' },
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'votedThisEpoch',
    outputs: [{ name: 'voted', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'epoch', internalType: 'uint256', type: 'uint256' },
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'votesPerEpoch',
    outputs: [{ name: 'votes', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'epoch', internalType: 'uint256', type: 'uint256' }],
    name: 'votingClosed',
    outputs: [{ name: 'votingClosed', internalType: 'bool', type: 'bool' }],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'hunter',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'victim',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'reward',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BountyCompleted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'reciever',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'tankId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Claim',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'poker',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'blocknumber',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Commit',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'cursedTank',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'voter',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'epoch',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Curse',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'killer',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'killed',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Death',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tank',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Delegate',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tankId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'epoch',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Drip',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'settings',
        internalType: 'struct ITankGame.GameSettings',
        type: 'tuple',
        components: [
          { name: 'playerCount', internalType: 'uint256', type: 'uint256' },
          { name: 'boardSize', internalType: 'uint256', type: 'uint256' },
          { name: 'initAPs', internalType: 'uint256', type: 'uint256' },
          { name: 'initHearts', internalType: 'uint256', type: 'uint256' },
          { name: 'initShootRange', internalType: 'uint256', type: 'uint256' },
          { name: 'epochSeconds', internalType: 'uint256', type: 'uint256' },
          { name: 'buyInMinimum', internalType: 'uint256', type: 'uint256' },
          {
            name: 'revealWaitBlocks',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'autoStart', internalType: 'bool', type: 'bool' },
          { name: 'root', internalType: 'bytes32', type: 'bytes32' },
        ],
        indexed: false,
      },
    ],
    name: 'GameInit',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'winner',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'second',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'third',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'prizePool',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'GameOver',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'GameStarted' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'fromId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'toId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'hearts',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'aps', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Give',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tankId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'hook',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'HooksAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tankId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'position',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
        indexed: false,
      },
    ],
    name: 'Move',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'player',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'tankId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'position',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
        indexed: false,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'PlayerJoined',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'donator',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newTotal',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PrizeIncrease',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'poker',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'blocknumber',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Reveal',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'savior',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'saved',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Revive',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tankId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'targetId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Shoot',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'poker',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'position',
        internalType: 'struct Board.Point',
        type: 'tuple',
        components: [
          { name: 'x', internalType: 'uint256', type: 'uint256' },
          { name: 'y', internalType: 'uint256', type: 'uint256' },
          { name: 'z', internalType: 'uint256', type: 'uint256' },
        ],
        indexed: false,
      },
    ],
    name: 'SpawnHeart',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tankId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'range',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Upgrade',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'voter',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'cursed',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'epoch',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Vote',
  },
] as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const tankGameAddress = {
  5: '0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414',
  31337: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
} as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const tankGameConfig = {
  address: tankGameAddress,
  abi: tankGameAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TankGameFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x9758ce8FE412C72893b42FFEdAEDff1840e1886f)
 * -
 */
export const tankGameFactoryAbi = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_gameView', internalType: 'contract GameView', type: 'address' },
      {
        name: '_hookFactory',
        internalType: 'contract HookFactory',
        type: 'address',
      },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_implementation', internalType: 'address', type: 'address' },
      {
        name: 'settings',
        internalType: 'struct ITankGame.GameSettings',
        type: 'tuple',
        components: [
          { name: 'playerCount', internalType: 'uint256', type: 'uint256' },
          { name: 'boardSize', internalType: 'uint256', type: 'uint256' },
          { name: 'initAPs', internalType: 'uint256', type: 'uint256' },
          { name: 'initHearts', internalType: 'uint256', type: 'uint256' },
          { name: 'initShootRange', internalType: 'uint256', type: 'uint256' },
          { name: 'epochSeconds', internalType: 'uint256', type: 'uint256' },
          { name: 'buyInMinimum', internalType: 'uint256', type: 'uint256' },
          {
            name: 'revealWaitBlocks',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'autoStart', internalType: 'bool', type: 'bool' },
          { name: 'root', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      { name: '_owner', internalType: 'address', type: 'address' },
    ],
    name: 'createGame',
    outputs: [
      { name: 'game', internalType: 'contract ITankGame', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'gameView',
    outputs: [{ name: '', internalType: 'contract GameView', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'hookFactory',
    outputs: [
      { name: '', internalType: 'contract HookFactory', type: 'address' },
    ],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'game',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'settings',
        internalType: 'struct ITankGame.GameSettings',
        type: 'tuple',
        components: [
          { name: 'playerCount', internalType: 'uint256', type: 'uint256' },
          { name: 'boardSize', internalType: 'uint256', type: 'uint256' },
          { name: 'initAPs', internalType: 'uint256', type: 'uint256' },
          { name: 'initHearts', internalType: 'uint256', type: 'uint256' },
          { name: 'initShootRange', internalType: 'uint256', type: 'uint256' },
          { name: 'epochSeconds', internalType: 'uint256', type: 'uint256' },
          { name: 'buyInMinimum', internalType: 'uint256', type: 'uint256' },
          {
            name: 'revealWaitBlocks',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'autoStart', internalType: 'bool', type: 'bool' },
          { name: 'root', internalType: 'bytes32', type: 'bytes32' },
        ],
        indexed: false,
      },
    ],
    name: 'GameCreated',
  },
  { type: 'error', inputs: [], name: 'ERC1167FailedCreateClone' },
] as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x9758ce8FE412C72893b42FFEdAEDff1840e1886f)
 * -
 */
export const tankGameFactoryAddress = {
  5: '0x9758ce8FE412C72893b42FFEdAEDff1840e1886f',
  31337: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
} as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x9758ce8FE412C72893b42FFEdAEDff1840e1886f)
 * -
 */
export const tankGameFactoryConfig = {
  address: tankGameFactoryAddress,
  abi: tankGameFactoryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TankGameV2Storage
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const tankGameV2StorageAbi = [
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'aliveTanksIdSum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'board',
    outputs: [{ name: '', internalType: 'contract Board', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tankId', internalType: 'uint256', type: 'uint256' }],
    name: 'claimed',
    outputs: [{ name: 'claimed', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'deadTanks',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
      { name: 'delegate', internalType: 'address', type: 'address' },
    ],
    name: 'delegates',
    outputs: [{ name: 'isDelegate', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'epochStart',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tankId', internalType: 'uint256', type: 'uint256' }],
    name: 'lastDripEpoch',
    outputs: [{ name: 'epoch', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'lastRevealBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'numTanksAlive',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'player', internalType: 'address', type: 'address' }],
    name: 'players',
    outputs: [{ name: 'tank', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'playersCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'podium',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'prizePool',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'revealBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'settings',
    outputs: [
      { name: 'playerCount', internalType: 'uint256', type: 'uint256' },
      { name: 'boardSize', internalType: 'uint256', type: 'uint256' },
      { name: 'initAPs', internalType: 'uint256', type: 'uint256' },
      { name: 'initHearts', internalType: 'uint256', type: 'uint256' },
      { name: 'initShootRange', internalType: 'uint256', type: 'uint256' },
      { name: 'epochSeconds', internalType: 'uint256', type: 'uint256' },
      { name: 'buyInMinimum', internalType: 'uint256', type: 'uint256' },
      { name: 'revealWaitBlocks', internalType: 'uint256', type: 'uint256' },
      { name: 'autoStart', internalType: 'bool', type: 'bool' },
      { name: 'root', internalType: 'bytes32', type: 'bytes32' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'state',
    outputs: [
      { name: '', internalType: 'enum ITankGame.GameState', type: 'uint8' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'stateData',
    outputs: [
      { name: 'playersCount', internalType: 'uint256', type: 'uint256' },
      { name: 'numTanksAlive', internalType: 'uint256', type: 'uint256' },
      { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
      { name: 'epochStart', internalType: 'uint256', type: 'uint256' },
      { name: 'aliveTanksIdSum', internalType: 'uint256', type: 'uint256' },
      { name: 'revealBlock', internalType: 'uint256', type: 'uint256' },
      { name: 'lastRevealBlock', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'tankHooks',
    outputs: [
      { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tankId', internalType: 'uint256', type: 'uint256' }],
    name: 'tanks',
    outputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'hearts', internalType: 'uint256', type: 'uint256' },
      { name: 'aps', internalType: 'uint256', type: 'uint256' },
      { name: 'range', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'epoch', internalType: 'uint256', type: 'uint256' },
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'votedThisEpoch',
    outputs: [{ name: 'voted', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'epoch', internalType: 'uint256', type: 'uint256' },
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'votesPerEpoch',
    outputs: [{ name: 'votes', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'epoch', internalType: 'uint256', type: 'uint256' }],
    name: 'votingClosed',
    outputs: [{ name: 'votingClosed', internalType: 'bool', type: 'bool' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boardAbi}__
 */
export const useBoardRead = /*#__PURE__*/ createUseReadContract({
  abi: boardAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boardAbi}__ and `functionName` set to `"boardSize"`
 */
export const useBoardBoardSize = /*#__PURE__*/ createUseReadContract({
  abi: boardAbi,
  functionName: 'boardSize',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boardAbi}__ and `functionName` set to `"getDistance"`
 */
export const useBoardGetDistance = /*#__PURE__*/ createUseReadContract({
  abi: boardAbi,
  functionName: 'getDistance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boardAbi}__ and `functionName` set to `"getDistanceTankToPoint"`
 */
export const useBoardGetDistanceTankToPoint =
  /*#__PURE__*/ createUseReadContract({
    abi: boardAbi,
    functionName: 'getDistanceTankToPoint',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boardAbi}__ and `functionName` set to `"getDistanceTanks"`
 */
export const useBoardGetDistanceTanks = /*#__PURE__*/ createUseReadContract({
  abi: boardAbi,
  functionName: 'getDistanceTanks',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boardAbi}__ and `functionName` set to `"getEmptyTile"`
 */
export const useBoardGetEmptyTile = /*#__PURE__*/ createUseReadContract({
  abi: boardAbi,
  functionName: 'getEmptyTile',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boardAbi}__ and `functionName` set to `"getHeartAtPosition"`
 */
export const useBoardGetHeartAtPosition = /*#__PURE__*/ createUseReadContract({
  abi: boardAbi,
  functionName: 'getHeartAtPosition',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boardAbi}__ and `functionName` set to `"getPerimeterForRadius"`
 */
export const useBoardGetPerimeterForRadius =
  /*#__PURE__*/ createUseReadContract({
    abi: boardAbi,
    functionName: 'getPerimeterForRadius',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boardAbi}__ and `functionName` set to `"getTankPosition"`
 */
export const useBoardGetTankPosition = /*#__PURE__*/ createUseReadContract({
  abi: boardAbi,
  functionName: 'getTankPosition',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boardAbi}__ and `functionName` set to `"getTile"`
 */
export const useBoardGetTile = /*#__PURE__*/ createUseReadContract({
  abi: boardAbi,
  functionName: 'getTile',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boardAbi}__ and `functionName` set to `"getTotalTiles"`
 */
export const useBoardGetTotalTiles = /*#__PURE__*/ createUseReadContract({
  abi: boardAbi,
  functionName: 'getTotalTiles',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boardAbi}__ and `functionName` set to `"isValidPoint"`
 */
export const useBoardIsValidPoint = /*#__PURE__*/ createUseReadContract({
  abi: boardAbi,
  functionName: 'isValidPoint',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boardAbi}__ and `functionName` set to `"pointToIndex"`
 */
export const useBoardPointToIndex = /*#__PURE__*/ createUseReadContract({
  abi: boardAbi,
  functionName: 'pointToIndex',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boardAbi}__ and `functionName` set to `"randomPoint"`
 */
export const useBoardRandomPoint = /*#__PURE__*/ createUseReadContract({
  abi: boardAbi,
  functionName: 'randomPoint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boardAbi}__
 */
export const useBoardWrite = /*#__PURE__*/ createUseWriteContract({
  abi: boardAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boardAbi}__ and `functionName` set to `"setTile"`
 */
export const useBoardSetTile = /*#__PURE__*/ createUseWriteContract({
  abi: boardAbi,
  functionName: 'setTile',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boardAbi}__
 */
export const usePrepareBoardWrite = /*#__PURE__*/ createUseSimulateContract({
  abi: boardAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boardAbi}__ and `functionName` set to `"setTile"`
 */
export const usePrepareBoardSetTile = /*#__PURE__*/ createUseSimulateContract({
  abi: boardAbi,
  functionName: 'setTile',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bountyAbi}__
 */
export const useBountyRead = /*#__PURE__*/ createUseReadContract({
  abi: bountyAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"afterClaim"`
 */
export const useBountyAfterClaim = /*#__PURE__*/ createUseReadContract({
  abi: bountyAbi,
  functionName: 'afterClaim',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"afterDelegate"`
 */
export const useBountyAfterDelegate = /*#__PURE__*/ createUseReadContract({
  abi: bountyAbi,
  functionName: 'afterDelegate',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"afterDrip"`
 */
export const useBountyAfterDrip = /*#__PURE__*/ createUseReadContract({
  abi: bountyAbi,
  functionName: 'afterDrip',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"afterJoin"`
 */
export const useBountyAfterJoin = /*#__PURE__*/ createUseReadContract({
  abi: bountyAbi,
  functionName: 'afterJoin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"beforeClaim"`
 */
export const useBountyBeforeClaim = /*#__PURE__*/ createUseReadContract({
  abi: bountyAbi,
  functionName: 'beforeClaim',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"beforeDelegate"`
 */
export const useBountyBeforeDelegate = /*#__PURE__*/ createUseReadContract({
  abi: bountyAbi,
  functionName: 'beforeDelegate',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"beforeDrip"`
 */
export const useBountyBeforeDrip = /*#__PURE__*/ createUseReadContract({
  abi: bountyAbi,
  functionName: 'beforeDrip',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"beforeGive"`
 */
export const useBountyBeforeGive = /*#__PURE__*/ createUseReadContract({
  abi: bountyAbi,
  functionName: 'beforeGive',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"beforeJoin"`
 */
export const useBountyBeforeJoin = /*#__PURE__*/ createUseReadContract({
  abi: bountyAbi,
  functionName: 'beforeJoin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"beforeReveal"`
 */
export const useBountyBeforeReveal = /*#__PURE__*/ createUseReadContract({
  abi: bountyAbi,
  functionName: 'beforeReveal',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"bounties"`
 */
export const useBountyBounties = /*#__PURE__*/ createUseReadContract({
  abi: bountyAbi,
  functionName: 'bounties',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"bountiesData"`
 */
export const useBountyBountiesData = /*#__PURE__*/ createUseReadContract({
  abi: bountyAbi,
  functionName: 'bountiesData',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"bountyCount"`
 */
export const useBountyBountyCount = /*#__PURE__*/ createUseReadContract({
  abi: bountyAbi,
  functionName: 'bountyCount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"ownerTank"`
 */
export const useBountyOwnerTank = /*#__PURE__*/ createUseReadContract({
  abi: bountyAbi,
  functionName: 'ownerTank',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"tankGame"`
 */
export const useBountyTankGame = /*#__PURE__*/ createUseReadContract({
  abi: bountyAbi,
  functionName: 'tankGame',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"tankGameView"`
 */
export const useBountyTankGameView = /*#__PURE__*/ createUseReadContract({
  abi: bountyAbi,
  functionName: 'tankGameView',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"withdrawals"`
 */
export const useBountyWithdrawals = /*#__PURE__*/ createUseReadContract({
  abi: bountyAbi,
  functionName: 'withdrawals',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bountyAbi}__
 */
export const useBountyWrite = /*#__PURE__*/ createUseWriteContract({
  abi: bountyAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"afterGive"`
 */
export const useBountyAfterGive = /*#__PURE__*/ createUseWriteContract({
  abi: bountyAbi,
  functionName: 'afterGive',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"afterMove"`
 */
export const useBountyAfterMove = /*#__PURE__*/ createUseWriteContract({
  abi: bountyAbi,
  functionName: 'afterMove',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"afterReveal"`
 */
export const useBountyAfterReveal = /*#__PURE__*/ createUseWriteContract({
  abi: bountyAbi,
  functionName: 'afterReveal',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"afterShoot"`
 */
export const useBountyAfterShoot = /*#__PURE__*/ createUseWriteContract({
  abi: bountyAbi,
  functionName: 'afterShoot',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"afterUpgrade"`
 */
export const useBountyAfterUpgrade = /*#__PURE__*/ createUseWriteContract({
  abi: bountyAbi,
  functionName: 'afterUpgrade',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"afterVote"`
 */
export const useBountyAfterVote = /*#__PURE__*/ createUseWriteContract({
  abi: bountyAbi,
  functionName: 'afterVote',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"beforeMove"`
 */
export const useBountyBeforeMove = /*#__PURE__*/ createUseWriteContract({
  abi: bountyAbi,
  functionName: 'beforeMove',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"beforeShoot"`
 */
export const useBountyBeforeShoot = /*#__PURE__*/ createUseWriteContract({
  abi: bountyAbi,
  functionName: 'beforeShoot',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"beforeUpgrade"`
 */
export const useBountyBeforeUpgrade = /*#__PURE__*/ createUseWriteContract({
  abi: bountyAbi,
  functionName: 'beforeUpgrade',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"beforeVote"`
 */
export const useBountyBeforeVote = /*#__PURE__*/ createUseWriteContract({
  abi: bountyAbi,
  functionName: 'beforeVote',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"cancel"`
 */
export const useBountyCancel = /*#__PURE__*/ createUseWriteContract({
  abi: bountyAbi,
  functionName: 'cancel',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"create"`
 */
export const useBountyCreate = /*#__PURE__*/ createUseWriteContract({
  abi: bountyAbi,
  functionName: 'create',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"withdraw"`
 */
export const useBountyWithdraw = /*#__PURE__*/ createUseWriteContract({
  abi: bountyAbi,
  functionName: 'withdraw',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bountyAbi}__
 */
export const usePrepareBountyWrite = /*#__PURE__*/ createUseSimulateContract({
  abi: bountyAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"afterGive"`
 */
export const usePrepareBountyAfterGive =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bountyAbi,
    functionName: 'afterGive',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"afterMove"`
 */
export const usePrepareBountyAfterMove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bountyAbi,
    functionName: 'afterMove',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"afterReveal"`
 */
export const usePrepareBountyAfterReveal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bountyAbi,
    functionName: 'afterReveal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"afterShoot"`
 */
export const usePrepareBountyAfterShoot =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bountyAbi,
    functionName: 'afterShoot',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"afterUpgrade"`
 */
export const usePrepareBountyAfterUpgrade =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bountyAbi,
    functionName: 'afterUpgrade',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"afterVote"`
 */
export const usePrepareBountyAfterVote =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bountyAbi,
    functionName: 'afterVote',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"beforeMove"`
 */
export const usePrepareBountyBeforeMove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bountyAbi,
    functionName: 'beforeMove',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"beforeShoot"`
 */
export const usePrepareBountyBeforeShoot =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bountyAbi,
    functionName: 'beforeShoot',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"beforeUpgrade"`
 */
export const usePrepareBountyBeforeUpgrade =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bountyAbi,
    functionName: 'beforeUpgrade',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"beforeVote"`
 */
export const usePrepareBountyBeforeVote =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bountyAbi,
    functionName: 'beforeVote',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"cancel"`
 */
export const usePrepareBountyCancel = /*#__PURE__*/ createUseSimulateContract({
  abi: bountyAbi,
  functionName: 'cancel',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"create"`
 */
export const usePrepareBountyCreate = /*#__PURE__*/ createUseSimulateContract({
  abi: bountyAbi,
  functionName: 'create',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bountyAbi}__ and `functionName` set to `"withdraw"`
 */
export const usePrepareBountyWithdraw = /*#__PURE__*/ createUseSimulateContract(
  { abi: bountyAbi, functionName: 'withdraw' },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bountyAbi}__
 */
export const useBountyEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: bountyAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bountyAbi}__ and `eventName` set to `"BountyHookCreated"`
 */
export const useBountyBountyHookCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: bountyAbi,
    eventName: 'BountyHookCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bountyAbi}__ and `eventName` set to `"BountyPosted"`
 */
export const useBountyBountyPostedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: bountyAbi,
    eventName: 'BountyPosted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bountyAbi}__ and `eventName` set to `"BountyWon"`
 */
export const useBountyBountyWonEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: bountyAbi,
    eventName: 'BountyWon',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bountyAbi}__ and `eventName` set to `"Withdraw"`
 */
export const useBountyWithdrawEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: bountyAbi, eventName: 'Withdraw' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__
 */
export const useDefaultEmptyHooksRead = /*#__PURE__*/ createUseReadContract({
  abi: defaultEmptyHooksAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"afterClaim"`
 */
export const useDefaultEmptyHooksAfterClaim =
  /*#__PURE__*/ createUseReadContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'afterClaim',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"afterDelegate"`
 */
export const useDefaultEmptyHooksAfterDelegate =
  /*#__PURE__*/ createUseReadContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'afterDelegate',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"afterDrip"`
 */
export const useDefaultEmptyHooksAfterDrip =
  /*#__PURE__*/ createUseReadContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'afterDrip',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"afterJoin"`
 */
export const useDefaultEmptyHooksAfterJoin =
  /*#__PURE__*/ createUseReadContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'afterJoin',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"beforeClaim"`
 */
export const useDefaultEmptyHooksBeforeClaim =
  /*#__PURE__*/ createUseReadContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'beforeClaim',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"beforeDelegate"`
 */
export const useDefaultEmptyHooksBeforeDelegate =
  /*#__PURE__*/ createUseReadContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'beforeDelegate',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"beforeDrip"`
 */
export const useDefaultEmptyHooksBeforeDrip =
  /*#__PURE__*/ createUseReadContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'beforeDrip',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"beforeGive"`
 */
export const useDefaultEmptyHooksBeforeGive =
  /*#__PURE__*/ createUseReadContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'beforeGive',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"beforeJoin"`
 */
export const useDefaultEmptyHooksBeforeJoin =
  /*#__PURE__*/ createUseReadContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'beforeJoin',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"beforeReveal"`
 */
export const useDefaultEmptyHooksBeforeReveal =
  /*#__PURE__*/ createUseReadContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'beforeReveal',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__
 */
export const useDefaultEmptyHooksWrite = /*#__PURE__*/ createUseWriteContract({
  abi: defaultEmptyHooksAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"afterGive"`
 */
export const useDefaultEmptyHooksAfterGive =
  /*#__PURE__*/ createUseWriteContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'afterGive',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"afterMove"`
 */
export const useDefaultEmptyHooksAfterMove =
  /*#__PURE__*/ createUseWriteContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'afterMove',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"afterReveal"`
 */
export const useDefaultEmptyHooksAfterReveal =
  /*#__PURE__*/ createUseWriteContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'afterReveal',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"afterShoot"`
 */
export const useDefaultEmptyHooksAfterShoot =
  /*#__PURE__*/ createUseWriteContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'afterShoot',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"afterUpgrade"`
 */
export const useDefaultEmptyHooksAfterUpgrade =
  /*#__PURE__*/ createUseWriteContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'afterUpgrade',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"afterVote"`
 */
export const useDefaultEmptyHooksAfterVote =
  /*#__PURE__*/ createUseWriteContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'afterVote',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"beforeMove"`
 */
export const useDefaultEmptyHooksBeforeMove =
  /*#__PURE__*/ createUseWriteContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'beforeMove',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"beforeShoot"`
 */
export const useDefaultEmptyHooksBeforeShoot =
  /*#__PURE__*/ createUseWriteContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'beforeShoot',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"beforeUpgrade"`
 */
export const useDefaultEmptyHooksBeforeUpgrade =
  /*#__PURE__*/ createUseWriteContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'beforeUpgrade',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"beforeVote"`
 */
export const useDefaultEmptyHooksBeforeVote =
  /*#__PURE__*/ createUseWriteContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'beforeVote',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__
 */
export const usePrepareDefaultEmptyHooksWrite =
  /*#__PURE__*/ createUseSimulateContract({ abi: defaultEmptyHooksAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"afterGive"`
 */
export const usePrepareDefaultEmptyHooksAfterGive =
  /*#__PURE__*/ createUseSimulateContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'afterGive',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"afterMove"`
 */
export const usePrepareDefaultEmptyHooksAfterMove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'afterMove',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"afterReveal"`
 */
export const usePrepareDefaultEmptyHooksAfterReveal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'afterReveal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"afterShoot"`
 */
export const usePrepareDefaultEmptyHooksAfterShoot =
  /*#__PURE__*/ createUseSimulateContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'afterShoot',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"afterUpgrade"`
 */
export const usePrepareDefaultEmptyHooksAfterUpgrade =
  /*#__PURE__*/ createUseSimulateContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'afterUpgrade',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"afterVote"`
 */
export const usePrepareDefaultEmptyHooksAfterVote =
  /*#__PURE__*/ createUseSimulateContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'afterVote',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"beforeMove"`
 */
export const usePrepareDefaultEmptyHooksBeforeMove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'beforeMove',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"beforeShoot"`
 */
export const usePrepareDefaultEmptyHooksBeforeShoot =
  /*#__PURE__*/ createUseSimulateContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'beforeShoot',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"beforeUpgrade"`
 */
export const usePrepareDefaultEmptyHooksBeforeUpgrade =
  /*#__PURE__*/ createUseSimulateContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'beforeUpgrade',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link defaultEmptyHooksAbi}__ and `functionName` set to `"beforeVote"`
 */
export const usePrepareDefaultEmptyHooksBeforeVote =
  /*#__PURE__*/ createUseSimulateContract({
    abi: defaultEmptyHooksAbi,
    functionName: 'beforeVote',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameViewAbi}__
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xE19866944E2CD0FfaE4e35d168149b9B934eA471)
 * -
 */
export const useGameViewRead = /*#__PURE__*/ createUseReadContract({
  abi: gameViewAbi,
  address: gameViewAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameViewAbi}__ and `functionName` set to `"getAllHearts"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xE19866944E2CD0FfaE4e35d168149b9B934eA471)
 * -
 */
export const useGameViewGetAllHearts = /*#__PURE__*/ createUseReadContract({
  abi: gameViewAbi,
  address: gameViewAddress,
  functionName: 'getAllHearts',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameViewAbi}__ and `functionName` set to `"getAllTanks"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xE19866944E2CD0FfaE4e35d168149b9B934eA471)
 * -
 */
export const useGameViewGetAllTanks = /*#__PURE__*/ createUseReadContract({
  abi: gameViewAbi,
  address: gameViewAddress,
  functionName: 'getAllTanks',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameViewAbi}__ and `functionName` set to `"getBoard"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xE19866944E2CD0FfaE4e35d168149b9B934eA471)
 * -
 */
export const useGameViewGetBoard = /*#__PURE__*/ createUseReadContract({
  abi: gameViewAbi,
  address: gameViewAddress,
  functionName: 'getBoard',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameViewAbi}__ and `functionName` set to `"getEpoch"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xE19866944E2CD0FfaE4e35d168149b9B934eA471)
 * -
 */
export const useGameViewGetEpoch = /*#__PURE__*/ createUseReadContract({
  abi: gameViewAbi,
  address: gameViewAddress,
  functionName: 'getEpoch',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameViewAbi}__ and `functionName` set to `"getGameEpoch"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xE19866944E2CD0FfaE4e35d168149b9B934eA471)
 * -
 */
export const useGameViewGetGameEpoch = /*#__PURE__*/ createUseReadContract({
  abi: gameViewAbi,
  address: gameViewAddress,
  functionName: 'getGameEpoch',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameViewAbi}__ and `functionName` set to `"getLastDrip"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xE19866944E2CD0FfaE4e35d168149b9B934eA471)
 * -
 */
export const useGameViewGetLastDrip = /*#__PURE__*/ createUseReadContract({
  abi: gameViewAbi,
  address: gameViewAddress,
  functionName: 'getLastDrip',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameViewAbi}__ and `functionName` set to `"getPlayerCount"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xE19866944E2CD0FfaE4e35d168149b9B934eA471)
 * -
 */
export const useGameViewGetPlayerCount = /*#__PURE__*/ createUseReadContract({
  abi: gameViewAbi,
  address: gameViewAddress,
  functionName: 'getPlayerCount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameViewAbi}__ and `functionName` set to `"getSettings"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xE19866944E2CD0FfaE4e35d168149b9B934eA471)
 * -
 */
export const useGameViewGetSettings = /*#__PURE__*/ createUseReadContract({
  abi: gameViewAbi,
  address: gameViewAddress,
  functionName: 'getSettings',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameViewAbi}__ and `functionName` set to `"getState"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xE19866944E2CD0FfaE4e35d168149b9B934eA471)
 * -
 */
export const useGameViewGetState = /*#__PURE__*/ createUseReadContract({
  abi: gameViewAbi,
  address: gameViewAddress,
  functionName: 'getState',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameViewAbi}__ and `functionName` set to `"getTank"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xE19866944E2CD0FfaE4e35d168149b9B934eA471)
 * -
 */
export const useGameViewGetTank = /*#__PURE__*/ createUseReadContract({
  abi: gameViewAbi,
  address: gameViewAddress,
  functionName: 'getTank',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameViewAbi}__ and `functionName` set to `"getUpgradeCost"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xE19866944E2CD0FfaE4e35d168149b9B934eA471)
 * -
 */
export const useGameViewGetUpgradeCost = /*#__PURE__*/ createUseReadContract({
  abi: gameViewAbi,
  address: gameViewAddress,
  functionName: 'getUpgradeCost',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gameViewAbi}__ and `functionName` set to `"isAuth"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xE19866944E2CD0FfaE4e35d168149b9B934eA471)
 * -
 */
export const useGameViewIsAuth = /*#__PURE__*/ createUseReadContract({
  abi: gameViewAbi,
  address: gameViewAddress,
  functionName: 'isAuth',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link hexBoardAbi}__
 */
export const useHexBoardRead = /*#__PURE__*/ createUseReadContract({
  abi: hexBoardAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link hexBoardAbi}__ and `functionName` set to `"boardSize"`
 */
export const useHexBoardBoardSize = /*#__PURE__*/ createUseReadContract({
  abi: hexBoardAbi,
  functionName: 'boardSize',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link hexBoardAbi}__ and `functionName` set to `"getDistance"`
 */
export const useHexBoardGetDistance = /*#__PURE__*/ createUseReadContract({
  abi: hexBoardAbi,
  functionName: 'getDistance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link hexBoardAbi}__ and `functionName` set to `"getDistanceTankToPoint"`
 */
export const useHexBoardGetDistanceTankToPoint =
  /*#__PURE__*/ createUseReadContract({
    abi: hexBoardAbi,
    functionName: 'getDistanceTankToPoint',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link hexBoardAbi}__ and `functionName` set to `"getDistanceTanks"`
 */
export const useHexBoardGetDistanceTanks = /*#__PURE__*/ createUseReadContract({
  abi: hexBoardAbi,
  functionName: 'getDistanceTanks',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link hexBoardAbi}__ and `functionName` set to `"getEmptyTile"`
 */
export const useHexBoardGetEmptyTile = /*#__PURE__*/ createUseReadContract({
  abi: hexBoardAbi,
  functionName: 'getEmptyTile',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link hexBoardAbi}__ and `functionName` set to `"getHeartAtPosition"`
 */
export const useHexBoardGetHeartAtPosition =
  /*#__PURE__*/ createUseReadContract({
    abi: hexBoardAbi,
    functionName: 'getHeartAtPosition',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link hexBoardAbi}__ and `functionName` set to `"getPerimeterForRadius"`
 */
export const useHexBoardGetPerimeterForRadius =
  /*#__PURE__*/ createUseReadContract({
    abi: hexBoardAbi,
    functionName: 'getPerimeterForRadius',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link hexBoardAbi}__ and `functionName` set to `"getTankPosition"`
 */
export const useHexBoardGetTankPosition = /*#__PURE__*/ createUseReadContract({
  abi: hexBoardAbi,
  functionName: 'getTankPosition',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link hexBoardAbi}__ and `functionName` set to `"getTile"`
 */
export const useHexBoardGetTile = /*#__PURE__*/ createUseReadContract({
  abi: hexBoardAbi,
  functionName: 'getTile',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link hexBoardAbi}__ and `functionName` set to `"getTotalTiles"`
 */
export const useHexBoardGetTotalTiles = /*#__PURE__*/ createUseReadContract({
  abi: hexBoardAbi,
  functionName: 'getTotalTiles',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link hexBoardAbi}__ and `functionName` set to `"heartsOnBoard"`
 */
export const useHexBoardHeartsOnBoard = /*#__PURE__*/ createUseReadContract({
  abi: hexBoardAbi,
  functionName: 'heartsOnBoard',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link hexBoardAbi}__ and `functionName` set to `"isValidPoint"`
 */
export const useHexBoardIsValidPoint = /*#__PURE__*/ createUseReadContract({
  abi: hexBoardAbi,
  functionName: 'isValidPoint',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link hexBoardAbi}__ and `functionName` set to `"pointToIndex"`
 */
export const useHexBoardPointToIndex = /*#__PURE__*/ createUseReadContract({
  abi: hexBoardAbi,
  functionName: 'pointToIndex',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link hexBoardAbi}__ and `functionName` set to `"randomPoint"`
 */
export const useHexBoardRandomPoint = /*#__PURE__*/ createUseReadContract({
  abi: hexBoardAbi,
  functionName: 'randomPoint',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link hexBoardAbi}__ and `functionName` set to `"tankToPosition"`
 */
export const useHexBoardTankToPosition = /*#__PURE__*/ createUseReadContract({
  abi: hexBoardAbi,
  functionName: 'tankToPosition',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link hexBoardAbi}__ and `functionName` set to `"tanksOnBoard"`
 */
export const useHexBoardTanksOnBoard = /*#__PURE__*/ createUseReadContract({
  abi: hexBoardAbi,
  functionName: 'tanksOnBoard',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link hexBoardAbi}__
 */
export const useHexBoardWrite = /*#__PURE__*/ createUseWriteContract({
  abi: hexBoardAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link hexBoardAbi}__ and `functionName` set to `"setTile"`
 */
export const useHexBoardSetTile = /*#__PURE__*/ createUseWriteContract({
  abi: hexBoardAbi,
  functionName: 'setTile',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link hexBoardAbi}__
 */
export const usePrepareHexBoardWrite = /*#__PURE__*/ createUseSimulateContract({
  abi: hexBoardAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link hexBoardAbi}__ and `functionName` set to `"setTile"`
 */
export const usePrepareHexBoardSetTile =
  /*#__PURE__*/ createUseSimulateContract({
    abi: hexBoardAbi,
    functionName: 'setTile',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link hookFactoryAbi}__
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2833Ee23DdAFa959D5ca459c6A64df2164B367b3)
 * -
 */
export const useHookFactoryWrite = /*#__PURE__*/ createUseWriteContract({
  abi: hookFactoryAbi,
  address: hookFactoryAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link hookFactoryAbi}__ and `functionName` set to `"createHook"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2833Ee23DdAFa959D5ca459c6A64df2164B367b3)
 * -
 */
export const useHookFactoryCreateHook = /*#__PURE__*/ createUseWriteContract({
  abi: hookFactoryAbi,
  address: hookFactoryAddress,
  functionName: 'createHook',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link hookFactoryAbi}__
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2833Ee23DdAFa959D5ca459c6A64df2164B367b3)
 * -
 */
export const usePrepareHookFactoryWrite =
  /*#__PURE__*/ createUseSimulateContract({
    abi: hookFactoryAbi,
    address: hookFactoryAddress,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link hookFactoryAbi}__ and `functionName` set to `"createHook"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2833Ee23DdAFa959D5ca459c6A64df2164B367b3)
 * -
 */
export const usePrepareHookFactoryCreateHook =
  /*#__PURE__*/ createUseSimulateContract({
    abi: hookFactoryAbi,
    address: hookFactoryAddress,
    functionName: 'createHook',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link hookFactoryAbi}__
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2833Ee23DdAFa959D5ca459c6A64df2164B367b3)
 * -
 */
export const useHookFactoryEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: hookFactoryAbi,
  address: hookFactoryAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link hookFactoryAbi}__ and `eventName` set to `"HookCreated"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2833Ee23DdAFa959D5ca459c6A64df2164B367b3)
 * -
 */
export const useHookFactoryHookCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: hookFactoryAbi,
    address: hookFactoryAddress,
    eventName: 'HookCreated',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGameViewAbi}__
 */
export const useIGameViewRead = /*#__PURE__*/ createUseReadContract({
  abi: iGameViewAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGameViewAbi}__ and `functionName` set to `"getAllHearts"`
 */
export const useIGameViewGetAllHearts = /*#__PURE__*/ createUseReadContract({
  abi: iGameViewAbi,
  functionName: 'getAllHearts',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGameViewAbi}__ and `functionName` set to `"getAllTanks"`
 */
export const useIGameViewGetAllTanks = /*#__PURE__*/ createUseReadContract({
  abi: iGameViewAbi,
  functionName: 'getAllTanks',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGameViewAbi}__ and `functionName` set to `"getBoard"`
 */
export const useIGameViewGetBoard = /*#__PURE__*/ createUseReadContract({
  abi: iGameViewAbi,
  functionName: 'getBoard',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGameViewAbi}__ and `functionName` set to `"getEpoch"`
 */
export const useIGameViewGetEpoch = /*#__PURE__*/ createUseReadContract({
  abi: iGameViewAbi,
  functionName: 'getEpoch',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGameViewAbi}__ and `functionName` set to `"getGameEpoch"`
 */
export const useIGameViewGetGameEpoch = /*#__PURE__*/ createUseReadContract({
  abi: iGameViewAbi,
  functionName: 'getGameEpoch',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGameViewAbi}__ and `functionName` set to `"getLastDrip"`
 */
export const useIGameViewGetLastDrip = /*#__PURE__*/ createUseReadContract({
  abi: iGameViewAbi,
  functionName: 'getLastDrip',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGameViewAbi}__ and `functionName` set to `"getPlayerCount"`
 */
export const useIGameViewGetPlayerCount = /*#__PURE__*/ createUseReadContract({
  abi: iGameViewAbi,
  functionName: 'getPlayerCount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGameViewAbi}__ and `functionName` set to `"getSettings"`
 */
export const useIGameViewGetSettings = /*#__PURE__*/ createUseReadContract({
  abi: iGameViewAbi,
  functionName: 'getSettings',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGameViewAbi}__ and `functionName` set to `"getState"`
 */
export const useIGameViewGetState = /*#__PURE__*/ createUseReadContract({
  abi: iGameViewAbi,
  functionName: 'getState',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGameViewAbi}__ and `functionName` set to `"getTank"`
 */
export const useIGameViewGetTank = /*#__PURE__*/ createUseReadContract({
  abi: iGameViewAbi,
  functionName: 'getTank',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGameViewAbi}__ and `functionName` set to `"isAuth"`
 */
export const useIGameViewIsAuth = /*#__PURE__*/ createUseReadContract({
  abi: iGameViewAbi,
  functionName: 'isAuth',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHooksAbi}__
 */
export const useIHooksWrite = /*#__PURE__*/ createUseWriteContract({
  abi: iHooksAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"afterClaim"`
 */
export const useIHooksAfterClaim = /*#__PURE__*/ createUseWriteContract({
  abi: iHooksAbi,
  functionName: 'afterClaim',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"afterDelegate"`
 */
export const useIHooksAfterDelegate = /*#__PURE__*/ createUseWriteContract({
  abi: iHooksAbi,
  functionName: 'afterDelegate',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"afterDrip"`
 */
export const useIHooksAfterDrip = /*#__PURE__*/ createUseWriteContract({
  abi: iHooksAbi,
  functionName: 'afterDrip',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"afterGive"`
 */
export const useIHooksAfterGive = /*#__PURE__*/ createUseWriteContract({
  abi: iHooksAbi,
  functionName: 'afterGive',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"afterJoin"`
 */
export const useIHooksAfterJoin = /*#__PURE__*/ createUseWriteContract({
  abi: iHooksAbi,
  functionName: 'afterJoin',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"afterMove"`
 */
export const useIHooksAfterMove = /*#__PURE__*/ createUseWriteContract({
  abi: iHooksAbi,
  functionName: 'afterMove',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"afterReveal"`
 */
export const useIHooksAfterReveal = /*#__PURE__*/ createUseWriteContract({
  abi: iHooksAbi,
  functionName: 'afterReveal',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"afterShoot"`
 */
export const useIHooksAfterShoot = /*#__PURE__*/ createUseWriteContract({
  abi: iHooksAbi,
  functionName: 'afterShoot',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"afterUpgrade"`
 */
export const useIHooksAfterUpgrade = /*#__PURE__*/ createUseWriteContract({
  abi: iHooksAbi,
  functionName: 'afterUpgrade',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"afterVote"`
 */
export const useIHooksAfterVote = /*#__PURE__*/ createUseWriteContract({
  abi: iHooksAbi,
  functionName: 'afterVote',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"beforeClaim"`
 */
export const useIHooksBeforeClaim = /*#__PURE__*/ createUseWriteContract({
  abi: iHooksAbi,
  functionName: 'beforeClaim',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"beforeDelegate"`
 */
export const useIHooksBeforeDelegate = /*#__PURE__*/ createUseWriteContract({
  abi: iHooksAbi,
  functionName: 'beforeDelegate',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"beforeDrip"`
 */
export const useIHooksBeforeDrip = /*#__PURE__*/ createUseWriteContract({
  abi: iHooksAbi,
  functionName: 'beforeDrip',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"beforeGive"`
 */
export const useIHooksBeforeGive = /*#__PURE__*/ createUseWriteContract({
  abi: iHooksAbi,
  functionName: 'beforeGive',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"beforeJoin"`
 */
export const useIHooksBeforeJoin = /*#__PURE__*/ createUseWriteContract({
  abi: iHooksAbi,
  functionName: 'beforeJoin',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"beforeMove"`
 */
export const useIHooksBeforeMove = /*#__PURE__*/ createUseWriteContract({
  abi: iHooksAbi,
  functionName: 'beforeMove',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"beforeReveal"`
 */
export const useIHooksBeforeReveal = /*#__PURE__*/ createUseWriteContract({
  abi: iHooksAbi,
  functionName: 'beforeReveal',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"beforeShoot"`
 */
export const useIHooksBeforeShoot = /*#__PURE__*/ createUseWriteContract({
  abi: iHooksAbi,
  functionName: 'beforeShoot',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"beforeUpgrade"`
 */
export const useIHooksBeforeUpgrade = /*#__PURE__*/ createUseWriteContract({
  abi: iHooksAbi,
  functionName: 'beforeUpgrade',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"beforeVote"`
 */
export const useIHooksBeforeVote = /*#__PURE__*/ createUseWriteContract({
  abi: iHooksAbi,
  functionName: 'beforeVote',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHooksAbi}__
 */
export const usePrepareIHooksWrite = /*#__PURE__*/ createUseSimulateContract({
  abi: iHooksAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"afterClaim"`
 */
export const usePrepareIHooksAfterClaim =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iHooksAbi,
    functionName: 'afterClaim',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"afterDelegate"`
 */
export const usePrepareIHooksAfterDelegate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iHooksAbi,
    functionName: 'afterDelegate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"afterDrip"`
 */
export const usePrepareIHooksAfterDrip =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iHooksAbi,
    functionName: 'afterDrip',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"afterGive"`
 */
export const usePrepareIHooksAfterGive =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iHooksAbi,
    functionName: 'afterGive',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"afterJoin"`
 */
export const usePrepareIHooksAfterJoin =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iHooksAbi,
    functionName: 'afterJoin',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"afterMove"`
 */
export const usePrepareIHooksAfterMove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iHooksAbi,
    functionName: 'afterMove',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"afterReveal"`
 */
export const usePrepareIHooksAfterReveal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iHooksAbi,
    functionName: 'afterReveal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"afterShoot"`
 */
export const usePrepareIHooksAfterShoot =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iHooksAbi,
    functionName: 'afterShoot',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"afterUpgrade"`
 */
export const usePrepareIHooksAfterUpgrade =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iHooksAbi,
    functionName: 'afterUpgrade',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"afterVote"`
 */
export const usePrepareIHooksAfterVote =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iHooksAbi,
    functionName: 'afterVote',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"beforeClaim"`
 */
export const usePrepareIHooksBeforeClaim =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iHooksAbi,
    functionName: 'beforeClaim',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"beforeDelegate"`
 */
export const usePrepareIHooksBeforeDelegate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iHooksAbi,
    functionName: 'beforeDelegate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"beforeDrip"`
 */
export const usePrepareIHooksBeforeDrip =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iHooksAbi,
    functionName: 'beforeDrip',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"beforeGive"`
 */
export const usePrepareIHooksBeforeGive =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iHooksAbi,
    functionName: 'beforeGive',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"beforeJoin"`
 */
export const usePrepareIHooksBeforeJoin =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iHooksAbi,
    functionName: 'beforeJoin',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"beforeMove"`
 */
export const usePrepareIHooksBeforeMove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iHooksAbi,
    functionName: 'beforeMove',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"beforeReveal"`
 */
export const usePrepareIHooksBeforeReveal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iHooksAbi,
    functionName: 'beforeReveal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"beforeShoot"`
 */
export const usePrepareIHooksBeforeShoot =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iHooksAbi,
    functionName: 'beforeShoot',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"beforeUpgrade"`
 */
export const usePrepareIHooksBeforeUpgrade =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iHooksAbi,
    functionName: 'beforeUpgrade',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHooksAbi}__ and `functionName` set to `"beforeVote"`
 */
export const usePrepareIHooksBeforeVote =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iHooksAbi,
    functionName: 'beforeVote',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__
 */
export const useIMulticall3Read = /*#__PURE__*/ createUseReadContract({
  abi: iMulticall3Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getBasefee"`
 */
export const useIMulticall3GetBasefee = /*#__PURE__*/ createUseReadContract({
  abi: iMulticall3Abi,
  functionName: 'getBasefee',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getBlockHash"`
 */
export const useIMulticall3GetBlockHash = /*#__PURE__*/ createUseReadContract({
  abi: iMulticall3Abi,
  functionName: 'getBlockHash',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getBlockNumber"`
 */
export const useIMulticall3GetBlockNumber = /*#__PURE__*/ createUseReadContract(
  { abi: iMulticall3Abi, functionName: 'getBlockNumber' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getChainId"`
 */
export const useIMulticall3GetChainId = /*#__PURE__*/ createUseReadContract({
  abi: iMulticall3Abi,
  functionName: 'getChainId',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getCurrentBlockCoinbase"`
 */
export const useIMulticall3GetCurrentBlockCoinbase =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getCurrentBlockCoinbase',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getCurrentBlockDifficulty"`
 */
export const useIMulticall3GetCurrentBlockDifficulty =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getCurrentBlockDifficulty',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getCurrentBlockGasLimit"`
 */
export const useIMulticall3GetCurrentBlockGasLimit =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getCurrentBlockGasLimit',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getCurrentBlockTimestamp"`
 */
export const useIMulticall3GetCurrentBlockTimestamp =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getCurrentBlockTimestamp',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getEthBalance"`
 */
export const useIMulticall3GetEthBalance = /*#__PURE__*/ createUseReadContract({
  abi: iMulticall3Abi,
  functionName: 'getEthBalance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getLastBlockHash"`
 */
export const useIMulticall3GetLastBlockHash =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getLastBlockHash',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__
 */
export const useIMulticall3Write = /*#__PURE__*/ createUseWriteContract({
  abi: iMulticall3Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"aggregate"`
 */
export const useIMulticall3Aggregate = /*#__PURE__*/ createUseWriteContract({
  abi: iMulticall3Abi,
  functionName: 'aggregate',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"aggregate3"`
 */
export const useIMulticall3Aggregate3 = /*#__PURE__*/ createUseWriteContract({
  abi: iMulticall3Abi,
  functionName: 'aggregate3',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"aggregate3Value"`
 */
export const useIMulticall3Aggregate3Value =
  /*#__PURE__*/ createUseWriteContract({
    abi: iMulticall3Abi,
    functionName: 'aggregate3Value',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"blockAndAggregate"`
 */
export const useIMulticall3BlockAndAggregate =
  /*#__PURE__*/ createUseWriteContract({
    abi: iMulticall3Abi,
    functionName: 'blockAndAggregate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"tryAggregate"`
 */
export const useIMulticall3TryAggregate = /*#__PURE__*/ createUseWriteContract({
  abi: iMulticall3Abi,
  functionName: 'tryAggregate',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"tryBlockAndAggregate"`
 */
export const useIMulticall3TryBlockAndAggregate =
  /*#__PURE__*/ createUseWriteContract({
    abi: iMulticall3Abi,
    functionName: 'tryBlockAndAggregate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__
 */
export const usePrepareIMulticall3Write =
  /*#__PURE__*/ createUseSimulateContract({ abi: iMulticall3Abi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"aggregate"`
 */
export const usePrepareIMulticall3Aggregate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iMulticall3Abi,
    functionName: 'aggregate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"aggregate3"`
 */
export const usePrepareIMulticall3Aggregate3 =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iMulticall3Abi,
    functionName: 'aggregate3',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"aggregate3Value"`
 */
export const usePrepareIMulticall3Aggregate3Value =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iMulticall3Abi,
    functionName: 'aggregate3Value',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"blockAndAggregate"`
 */
export const usePrepareIMulticall3BlockAndAggregate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iMulticall3Abi,
    functionName: 'blockAndAggregate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"tryAggregate"`
 */
export const usePrepareIMulticall3TryAggregate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iMulticall3Abi,
    functionName: 'tryAggregate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"tryBlockAndAggregate"`
 */
export const usePrepareIMulticall3TryBlockAndAggregate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iMulticall3Abi,
    functionName: 'tryBlockAndAggregate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTankGameAbi}__
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameWrite = /*#__PURE__*/ createUseWriteContract({
  abi: iTankGameAbi,
  address: iTankGameAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTankGameAbi}__ and `functionName` set to `"addHooks"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameAddHooks = /*#__PURE__*/ createUseWriteContract({
  abi: iTankGameAbi,
  address: iTankGameAddress,
  functionName: 'addHooks',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTankGameAbi}__ and `functionName` set to `"claim"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameClaim = /*#__PURE__*/ createUseWriteContract({
  abi: iTankGameAbi,
  address: iTankGameAddress,
  functionName: 'claim',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTankGameAbi}__ and `functionName` set to `"delegate"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameDelegate = /*#__PURE__*/ createUseWriteContract({
  abi: iTankGameAbi,
  address: iTankGameAddress,
  functionName: 'delegate',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTankGameAbi}__ and `functionName` set to `"drip"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameDrip = /*#__PURE__*/ createUseWriteContract({
  abi: iTankGameAbi,
  address: iTankGameAddress,
  functionName: 'drip',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTankGameAbi}__ and `functionName` set to `"forceAddDefaultHook"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameForceAddDefaultHook =
  /*#__PURE__*/ createUseWriteContract({
    abi: iTankGameAbi,
    address: iTankGameAddress,
    functionName: 'forceAddDefaultHook',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTankGameAbi}__ and `functionName` set to `"give"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameGive = /*#__PURE__*/ createUseWriteContract({
  abi: iTankGameAbi,
  address: iTankGameAddress,
  functionName: 'give',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTankGameAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: iTankGameAbi,
  address: iTankGameAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTankGameAbi}__ and `functionName` set to `"join"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameJoin = /*#__PURE__*/ createUseWriteContract({
  abi: iTankGameAbi,
  address: iTankGameAddress,
  functionName: 'join',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTankGameAbi}__ and `functionName` set to `"move"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameMove = /*#__PURE__*/ createUseWriteContract({
  abi: iTankGameAbi,
  address: iTankGameAddress,
  functionName: 'move',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTankGameAbi}__ and `functionName` set to `"reveal"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameReveal = /*#__PURE__*/ createUseWriteContract({
  abi: iTankGameAbi,
  address: iTankGameAddress,
  functionName: 'reveal',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTankGameAbi}__ and `functionName` set to `"shoot"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameShoot = /*#__PURE__*/ createUseWriteContract({
  abi: iTankGameAbi,
  address: iTankGameAddress,
  functionName: 'shoot',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTankGameAbi}__ and `functionName` set to `"upgrade"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameUpgrade = /*#__PURE__*/ createUseWriteContract({
  abi: iTankGameAbi,
  address: iTankGameAddress,
  functionName: 'upgrade',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTankGameAbi}__ and `functionName` set to `"vote"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameVote = /*#__PURE__*/ createUseWriteContract({
  abi: iTankGameAbi,
  address: iTankGameAddress,
  functionName: 'vote',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTankGameAbi}__
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareITankGameWrite = /*#__PURE__*/ createUseSimulateContract(
  { abi: iTankGameAbi, address: iTankGameAddress },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTankGameAbi}__ and `functionName` set to `"addHooks"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareITankGameAddHooks =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iTankGameAbi,
    address: iTankGameAddress,
    functionName: 'addHooks',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTankGameAbi}__ and `functionName` set to `"claim"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareITankGameClaim = /*#__PURE__*/ createUseSimulateContract(
  { abi: iTankGameAbi, address: iTankGameAddress, functionName: 'claim' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTankGameAbi}__ and `functionName` set to `"delegate"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareITankGameDelegate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iTankGameAbi,
    address: iTankGameAddress,
    functionName: 'delegate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTankGameAbi}__ and `functionName` set to `"drip"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareITankGameDrip = /*#__PURE__*/ createUseSimulateContract({
  abi: iTankGameAbi,
  address: iTankGameAddress,
  functionName: 'drip',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTankGameAbi}__ and `functionName` set to `"forceAddDefaultHook"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareITankGameForceAddDefaultHook =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iTankGameAbi,
    address: iTankGameAddress,
    functionName: 'forceAddDefaultHook',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTankGameAbi}__ and `functionName` set to `"give"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareITankGameGive = /*#__PURE__*/ createUseSimulateContract({
  abi: iTankGameAbi,
  address: iTankGameAddress,
  functionName: 'give',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTankGameAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareITankGameInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iTankGameAbi,
    address: iTankGameAddress,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTankGameAbi}__ and `functionName` set to `"join"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareITankGameJoin = /*#__PURE__*/ createUseSimulateContract({
  abi: iTankGameAbi,
  address: iTankGameAddress,
  functionName: 'join',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTankGameAbi}__ and `functionName` set to `"move"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareITankGameMove = /*#__PURE__*/ createUseSimulateContract({
  abi: iTankGameAbi,
  address: iTankGameAddress,
  functionName: 'move',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTankGameAbi}__ and `functionName` set to `"reveal"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareITankGameReveal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iTankGameAbi,
    address: iTankGameAddress,
    functionName: 'reveal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTankGameAbi}__ and `functionName` set to `"shoot"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareITankGameShoot = /*#__PURE__*/ createUseSimulateContract(
  { abi: iTankGameAbi, address: iTankGameAddress, functionName: 'shoot' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTankGameAbi}__ and `functionName` set to `"upgrade"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareITankGameUpgrade =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iTankGameAbi,
    address: iTankGameAddress,
    functionName: 'upgrade',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTankGameAbi}__ and `functionName` set to `"vote"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareITankGameVote = /*#__PURE__*/ createUseSimulateContract({
  abi: iTankGameAbi,
  address: iTankGameAddress,
  functionName: 'vote',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTankGameAbi}__
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: iTankGameAbi,
  address: iTankGameAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTankGameAbi}__ and `eventName` set to `"BountyCompleted"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameBountyCompletedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iTankGameAbi,
    address: iTankGameAddress,
    eventName: 'BountyCompleted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTankGameAbi}__ and `eventName` set to `"Claim"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameClaimEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: iTankGameAbi, address: iTankGameAddress, eventName: 'Claim' },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTankGameAbi}__ and `eventName` set to `"Commit"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameCommitEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iTankGameAbi,
    address: iTankGameAddress,
    eventName: 'Commit',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTankGameAbi}__ and `eventName` set to `"Curse"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameCurseEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: iTankGameAbi, address: iTankGameAddress, eventName: 'Curse' },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTankGameAbi}__ and `eventName` set to `"Death"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameDeathEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: iTankGameAbi, address: iTankGameAddress, eventName: 'Death' },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTankGameAbi}__ and `eventName` set to `"Delegate"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameDelegateEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iTankGameAbi,
    address: iTankGameAddress,
    eventName: 'Delegate',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTankGameAbi}__ and `eventName` set to `"Drip"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameDripEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: iTankGameAbi,
  address: iTankGameAddress,
  eventName: 'Drip',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTankGameAbi}__ and `eventName` set to `"GameInit"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameGameInitEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iTankGameAbi,
    address: iTankGameAddress,
    eventName: 'GameInit',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTankGameAbi}__ and `eventName` set to `"GameOver"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameGameOverEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iTankGameAbi,
    address: iTankGameAddress,
    eventName: 'GameOver',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTankGameAbi}__ and `eventName` set to `"GameStarted"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameGameStartedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iTankGameAbi,
    address: iTankGameAddress,
    eventName: 'GameStarted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTankGameAbi}__ and `eventName` set to `"Give"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameGiveEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: iTankGameAbi,
  address: iTankGameAddress,
  eventName: 'Give',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTankGameAbi}__ and `eventName` set to `"HooksAdded"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameHooksAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iTankGameAbi,
    address: iTankGameAddress,
    eventName: 'HooksAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTankGameAbi}__ and `eventName` set to `"Move"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameMoveEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: iTankGameAbi,
  address: iTankGameAddress,
  eventName: 'Move',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTankGameAbi}__ and `eventName` set to `"PlayerJoined"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGamePlayerJoinedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iTankGameAbi,
    address: iTankGameAddress,
    eventName: 'PlayerJoined',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTankGameAbi}__ and `eventName` set to `"PrizeIncrease"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGamePrizeIncreaseEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iTankGameAbi,
    address: iTankGameAddress,
    eventName: 'PrizeIncrease',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTankGameAbi}__ and `eventName` set to `"Reveal"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameRevealEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iTankGameAbi,
    address: iTankGameAddress,
    eventName: 'Reveal',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTankGameAbi}__ and `eventName` set to `"Revive"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameReviveEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iTankGameAbi,
    address: iTankGameAddress,
    eventName: 'Revive',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTankGameAbi}__ and `eventName` set to `"Shoot"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameShootEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: iTankGameAbi, address: iTankGameAddress, eventName: 'Shoot' },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTankGameAbi}__ and `eventName` set to `"SpawnHeart"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameSpawnHeartEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iTankGameAbi,
    address: iTankGameAddress,
    eventName: 'SpawnHeart',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTankGameAbi}__ and `eventName` set to `"Upgrade"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameUpgradeEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iTankGameAbi,
    address: iTankGameAddress,
    eventName: 'Upgrade',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTankGameAbi}__ and `eventName` set to `"Vote"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useITankGameVoteEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: iTankGameAbi,
  address: iTankGameAddress,
  eventName: 'Vote',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTreatyAbi}__
 */
export const useITreatyWrite = /*#__PURE__*/ createUseWriteContract({
  abi: iTreatyAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTreatyAbi}__ and `functionName` set to `"accept"`
 */
export const useITreatyAccept = /*#__PURE__*/ createUseWriteContract({
  abi: iTreatyAbi,
  functionName: 'accept',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTreatyAbi}__ and `functionName` set to `"propose"`
 */
export const useITreatyPropose = /*#__PURE__*/ createUseWriteContract({
  abi: iTreatyAbi,
  functionName: 'propose',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTreatyAbi}__
 */
export const usePrepareITreatyWrite = /*#__PURE__*/ createUseSimulateContract({
  abi: iTreatyAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTreatyAbi}__ and `functionName` set to `"accept"`
 */
export const usePrepareITreatyAccept = /*#__PURE__*/ createUseSimulateContract({
  abi: iTreatyAbi,
  functionName: 'accept',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTreatyAbi}__ and `functionName` set to `"propose"`
 */
export const usePrepareITreatyPropose = /*#__PURE__*/ createUseSimulateContract(
  { abi: iTreatyAbi, functionName: 'propose' },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTreatyAbi}__
 */
export const useITreatyEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: iTreatyAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTreatyAbi}__ and `eventName` set to `"AcceptedTreaty"`
 */
export const useITreatyAcceptedTreatyEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iTreatyAbi,
    eventName: 'AcceptedTreaty',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTreatyAbi}__ and `eventName` set to `"ProposedTreaty"`
 */
export const useITreatyProposedTreatyEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iTreatyAbi,
    eventName: 'ProposedTreaty',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nonAggressionAbi}__
 */
export const useNonAggressionRead = /*#__PURE__*/ createUseReadContract({
  abi: nonAggressionAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"afterClaim"`
 */
export const useNonAggressionAfterClaim = /*#__PURE__*/ createUseReadContract({
  abi: nonAggressionAbi,
  functionName: 'afterClaim',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"afterDelegate"`
 */
export const useNonAggressionAfterDelegate =
  /*#__PURE__*/ createUseReadContract({
    abi: nonAggressionAbi,
    functionName: 'afterDelegate',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"afterDrip"`
 */
export const useNonAggressionAfterDrip = /*#__PURE__*/ createUseReadContract({
  abi: nonAggressionAbi,
  functionName: 'afterDrip',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"afterJoin"`
 */
export const useNonAggressionAfterJoin = /*#__PURE__*/ createUseReadContract({
  abi: nonAggressionAbi,
  functionName: 'afterJoin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"allies"`
 */
export const useNonAggressionAllies = /*#__PURE__*/ createUseReadContract({
  abi: nonAggressionAbi,
  functionName: 'allies',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"beforeClaim"`
 */
export const useNonAggressionBeforeClaim = /*#__PURE__*/ createUseReadContract({
  abi: nonAggressionAbi,
  functionName: 'beforeClaim',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"beforeDelegate"`
 */
export const useNonAggressionBeforeDelegate =
  /*#__PURE__*/ createUseReadContract({
    abi: nonAggressionAbi,
    functionName: 'beforeDelegate',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"beforeDrip"`
 */
export const useNonAggressionBeforeDrip = /*#__PURE__*/ createUseReadContract({
  abi: nonAggressionAbi,
  functionName: 'beforeDrip',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"beforeGive"`
 */
export const useNonAggressionBeforeGive = /*#__PURE__*/ createUseReadContract({
  abi: nonAggressionAbi,
  functionName: 'beforeGive',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"beforeJoin"`
 */
export const useNonAggressionBeforeJoin = /*#__PURE__*/ createUseReadContract({
  abi: nonAggressionAbi,
  functionName: 'beforeJoin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"beforeReveal"`
 */
export const useNonAggressionBeforeReveal = /*#__PURE__*/ createUseReadContract(
  { abi: nonAggressionAbi, functionName: 'beforeReveal' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"beforeShoot"`
 */
export const useNonAggressionBeforeShoot = /*#__PURE__*/ createUseReadContract({
  abi: nonAggressionAbi,
  functionName: 'beforeShoot',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"ownerTank"`
 */
export const useNonAggressionOwnerTank = /*#__PURE__*/ createUseReadContract({
  abi: nonAggressionAbi,
  functionName: 'ownerTank',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"proposals"`
 */
export const useNonAggressionProposals = /*#__PURE__*/ createUseReadContract({
  abi: nonAggressionAbi,
  functionName: 'proposals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"tankGame"`
 */
export const useNonAggressionTankGame = /*#__PURE__*/ createUseReadContract({
  abi: nonAggressionAbi,
  functionName: 'tankGame',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"tankGameView"`
 */
export const useNonAggressionTankGameView = /*#__PURE__*/ createUseReadContract(
  { abi: nonAggressionAbi, functionName: 'tankGameView' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nonAggressionAbi}__
 */
export const useNonAggressionWrite = /*#__PURE__*/ createUseWriteContract({
  abi: nonAggressionAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"accept"`
 */
export const useNonAggressionAccept = /*#__PURE__*/ createUseWriteContract({
  abi: nonAggressionAbi,
  functionName: 'accept',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"afterGive"`
 */
export const useNonAggressionAfterGive = /*#__PURE__*/ createUseWriteContract({
  abi: nonAggressionAbi,
  functionName: 'afterGive',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"afterMove"`
 */
export const useNonAggressionAfterMove = /*#__PURE__*/ createUseWriteContract({
  abi: nonAggressionAbi,
  functionName: 'afterMove',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"afterReveal"`
 */
export const useNonAggressionAfterReveal = /*#__PURE__*/ createUseWriteContract(
  { abi: nonAggressionAbi, functionName: 'afterReveal' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"afterShoot"`
 */
export const useNonAggressionAfterShoot = /*#__PURE__*/ createUseWriteContract({
  abi: nonAggressionAbi,
  functionName: 'afterShoot',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"afterUpgrade"`
 */
export const useNonAggressionAfterUpgrade =
  /*#__PURE__*/ createUseWriteContract({
    abi: nonAggressionAbi,
    functionName: 'afterUpgrade',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"afterVote"`
 */
export const useNonAggressionAfterVote = /*#__PURE__*/ createUseWriteContract({
  abi: nonAggressionAbi,
  functionName: 'afterVote',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"beforeMove"`
 */
export const useNonAggressionBeforeMove = /*#__PURE__*/ createUseWriteContract({
  abi: nonAggressionAbi,
  functionName: 'beforeMove',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"beforeUpgrade"`
 */
export const useNonAggressionBeforeUpgrade =
  /*#__PURE__*/ createUseWriteContract({
    abi: nonAggressionAbi,
    functionName: 'beforeUpgrade',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"beforeVote"`
 */
export const useNonAggressionBeforeVote = /*#__PURE__*/ createUseWriteContract({
  abi: nonAggressionAbi,
  functionName: 'beforeVote',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"propose"`
 */
export const useNonAggressionPropose = /*#__PURE__*/ createUseWriteContract({
  abi: nonAggressionAbi,
  functionName: 'propose',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nonAggressionAbi}__
 */
export const usePrepareNonAggressionWrite =
  /*#__PURE__*/ createUseSimulateContract({ abi: nonAggressionAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"accept"`
 */
export const usePrepareNonAggressionAccept =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nonAggressionAbi,
    functionName: 'accept',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"afterGive"`
 */
export const usePrepareNonAggressionAfterGive =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nonAggressionAbi,
    functionName: 'afterGive',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"afterMove"`
 */
export const usePrepareNonAggressionAfterMove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nonAggressionAbi,
    functionName: 'afterMove',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"afterReveal"`
 */
export const usePrepareNonAggressionAfterReveal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nonAggressionAbi,
    functionName: 'afterReveal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"afterShoot"`
 */
export const usePrepareNonAggressionAfterShoot =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nonAggressionAbi,
    functionName: 'afterShoot',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"afterUpgrade"`
 */
export const usePrepareNonAggressionAfterUpgrade =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nonAggressionAbi,
    functionName: 'afterUpgrade',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"afterVote"`
 */
export const usePrepareNonAggressionAfterVote =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nonAggressionAbi,
    functionName: 'afterVote',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"beforeMove"`
 */
export const usePrepareNonAggressionBeforeMove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nonAggressionAbi,
    functionName: 'beforeMove',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"beforeUpgrade"`
 */
export const usePrepareNonAggressionBeforeUpgrade =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nonAggressionAbi,
    functionName: 'beforeUpgrade',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"beforeVote"`
 */
export const usePrepareNonAggressionBeforeVote =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nonAggressionAbi,
    functionName: 'beforeVote',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nonAggressionAbi}__ and `functionName` set to `"propose"`
 */
export const usePrepareNonAggressionPropose =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nonAggressionAbi,
    functionName: 'propose',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nonAggressionAbi}__
 */
export const useNonAggressionEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nonAggressionAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nonAggressionAbi}__ and `eventName` set to `"AcceptedTreaty"`
 */
export const useNonAggressionAcceptedTreatyEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nonAggressionAbi,
    eventName: 'AcceptedTreaty',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nonAggressionAbi}__ and `eventName` set to `"NonAggressionCreated"`
 */
export const useNonAggressionNonAggressionCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nonAggressionAbi,
    eventName: 'NonAggressionCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nonAggressionAbi}__ and `eventName` set to `"ProposedTreaty"`
 */
export const useNonAggressionProposedTreatyEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nonAggressionAbi,
    eventName: 'ProposedTreaty',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameRead = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"_getEpoch"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameGetEpoch = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: '_getEpoch',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"aliveTanksIdSum"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameAliveTanksIdSum = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'aliveTanksIdSum',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"board"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameBoard = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'board',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"claimed"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameClaimed = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'claimed',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"deadTanks"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameDeadTanks = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'deadTanks',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"delegates"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameDelegates = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'delegates',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"epochStart"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameEpochStart = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'epochStart',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"factory"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameFactory = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'factory',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"getLastDrip"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameGetLastDrip = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'getLastDrip',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"getUpgradeCost"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameGetUpgradeCost = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'getUpgradeCost',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"isAuth"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameIsAuth = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'isAuth',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"lastDripEpoch"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameLastDripEpoch = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'lastDripEpoch',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"lastRevealBlock"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameLastRevealBlock = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'lastRevealBlock',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"numTanksAlive"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameNumTanksAlive = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'numTanksAlive',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameOwner = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"players"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGamePlayers = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'players',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"playersCount"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGamePlayersCount = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'playersCount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"podium"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGamePodium = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'podium',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"prizePool"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGamePrizePool = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'prizePool',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"revealBlock"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameRevealBlock = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'revealBlock',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"settings"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameSettings = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'settings',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"state"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameState = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'state',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"stateData"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameStateData = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'stateData',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"tankHooks"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameTankHooks = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'tankHooks',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"tanks"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameTanks = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'tanks',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"votedThisEpoch"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameVotedThisEpoch = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'votedThisEpoch',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"votesPerEpoch"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameVotesPerEpoch = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'votesPerEpoch',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"votingClosed"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameVotingClosed = /*#__PURE__*/ createUseReadContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'votingClosed',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tankGameAbi}__
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameWrite = /*#__PURE__*/ createUseWriteContract({
  abi: tankGameAbi,
  address: tankGameAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"addHooks"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameAddHooks = /*#__PURE__*/ createUseWriteContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'addHooks',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"claim"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameClaim = /*#__PURE__*/ createUseWriteContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'claim',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"delegate"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameDelegate = /*#__PURE__*/ createUseWriteContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'delegate',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"donate"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameDonate = /*#__PURE__*/ createUseWriteContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'donate',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"drip"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameDrip = /*#__PURE__*/ createUseWriteContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'drip',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"forceAddDefaultHook"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameForceAddDefaultHook =
  /*#__PURE__*/ createUseWriteContract({
    abi: tankGameAbi,
    address: tankGameAddress,
    functionName: 'forceAddDefaultHook',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"give"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameGive = /*#__PURE__*/ createUseWriteContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'give',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"join"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameJoin = /*#__PURE__*/ createUseWriteContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'join',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"move"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameMove = /*#__PURE__*/ createUseWriteContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'move',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"reveal"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameReveal = /*#__PURE__*/ createUseWriteContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'reveal',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"setOwner"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameSetOwner = /*#__PURE__*/ createUseWriteContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'setOwner',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"shoot"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameShoot = /*#__PURE__*/ createUseWriteContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'shoot',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"start"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameStart = /*#__PURE__*/ createUseWriteContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'start',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"upgrade"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameUpgrade = /*#__PURE__*/ createUseWriteContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'upgrade',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"vote"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameVote = /*#__PURE__*/ createUseWriteContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'vote',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tankGameAbi}__
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareTankGameWrite = /*#__PURE__*/ createUseSimulateContract({
  abi: tankGameAbi,
  address: tankGameAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"addHooks"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareTankGameAddHooks =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tankGameAbi,
    address: tankGameAddress,
    functionName: 'addHooks',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"claim"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareTankGameClaim = /*#__PURE__*/ createUseSimulateContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'claim',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"delegate"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareTankGameDelegate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tankGameAbi,
    address: tankGameAddress,
    functionName: 'delegate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"donate"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareTankGameDonate = /*#__PURE__*/ createUseSimulateContract(
  { abi: tankGameAbi, address: tankGameAddress, functionName: 'donate' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"drip"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareTankGameDrip = /*#__PURE__*/ createUseSimulateContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'drip',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"forceAddDefaultHook"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareTankGameForceAddDefaultHook =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tankGameAbi,
    address: tankGameAddress,
    functionName: 'forceAddDefaultHook',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"give"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareTankGameGive = /*#__PURE__*/ createUseSimulateContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'give',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareTankGameInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tankGameAbi,
    address: tankGameAddress,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"join"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareTankGameJoin = /*#__PURE__*/ createUseSimulateContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'join',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"move"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareTankGameMove = /*#__PURE__*/ createUseSimulateContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'move',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"reveal"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareTankGameReveal = /*#__PURE__*/ createUseSimulateContract(
  { abi: tankGameAbi, address: tankGameAddress, functionName: 'reveal' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"setOwner"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareTankGameSetOwner =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tankGameAbi,
    address: tankGameAddress,
    functionName: 'setOwner',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"shoot"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareTankGameShoot = /*#__PURE__*/ createUseSimulateContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'shoot',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"start"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareTankGameStart = /*#__PURE__*/ createUseSimulateContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'start',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"upgrade"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareTankGameUpgrade =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tankGameAbi,
    address: tankGameAddress,
    functionName: 'upgrade',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tankGameAbi}__ and `functionName` set to `"vote"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const usePrepareTankGameVote = /*#__PURE__*/ createUseSimulateContract({
  abi: tankGameAbi,
  address: tankGameAddress,
  functionName: 'vote',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tankGameAbi}__
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: tankGameAbi,
  address: tankGameAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tankGameAbi}__ and `eventName` set to `"BountyCompleted"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameBountyCompletedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tankGameAbi,
    address: tankGameAddress,
    eventName: 'BountyCompleted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tankGameAbi}__ and `eventName` set to `"Claim"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameClaimEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: tankGameAbi,
  address: tankGameAddress,
  eventName: 'Claim',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tankGameAbi}__ and `eventName` set to `"Commit"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameCommitEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: tankGameAbi, address: tankGameAddress, eventName: 'Commit' },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tankGameAbi}__ and `eventName` set to `"Curse"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameCurseEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: tankGameAbi,
  address: tankGameAddress,
  eventName: 'Curse',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tankGameAbi}__ and `eventName` set to `"Death"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameDeathEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: tankGameAbi,
  address: tankGameAddress,
  eventName: 'Death',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tankGameAbi}__ and `eventName` set to `"Delegate"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameDelegateEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tankGameAbi,
    address: tankGameAddress,
    eventName: 'Delegate',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tankGameAbi}__ and `eventName` set to `"Drip"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameDripEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: tankGameAbi,
  address: tankGameAddress,
  eventName: 'Drip',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tankGameAbi}__ and `eventName` set to `"GameInit"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameGameInitEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tankGameAbi,
    address: tankGameAddress,
    eventName: 'GameInit',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tankGameAbi}__ and `eventName` set to `"GameOver"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameGameOverEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tankGameAbi,
    address: tankGameAddress,
    eventName: 'GameOver',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tankGameAbi}__ and `eventName` set to `"GameStarted"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameGameStartedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tankGameAbi,
    address: tankGameAddress,
    eventName: 'GameStarted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tankGameAbi}__ and `eventName` set to `"Give"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameGiveEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: tankGameAbi,
  address: tankGameAddress,
  eventName: 'Give',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tankGameAbi}__ and `eventName` set to `"HooksAdded"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameHooksAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tankGameAbi,
    address: tankGameAddress,
    eventName: 'HooksAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tankGameAbi}__ and `eventName` set to `"Move"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameMoveEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: tankGameAbi,
  address: tankGameAddress,
  eventName: 'Move',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tankGameAbi}__ and `eventName` set to `"PlayerJoined"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGamePlayerJoinedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tankGameAbi,
    address: tankGameAddress,
    eventName: 'PlayerJoined',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tankGameAbi}__ and `eventName` set to `"PrizeIncrease"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGamePrizeIncreaseEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tankGameAbi,
    address: tankGameAddress,
    eventName: 'PrizeIncrease',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tankGameAbi}__ and `eventName` set to `"Reveal"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameRevealEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: tankGameAbi, address: tankGameAddress, eventName: 'Reveal' },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tankGameAbi}__ and `eventName` set to `"Revive"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameReviveEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: tankGameAbi, address: tankGameAddress, eventName: 'Revive' },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tankGameAbi}__ and `eventName` set to `"Shoot"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameShootEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: tankGameAbi,
  address: tankGameAddress,
  eventName: 'Shoot',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tankGameAbi}__ and `eventName` set to `"SpawnHeart"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameSpawnHeartEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tankGameAbi,
    address: tankGameAddress,
    eventName: 'SpawnHeart',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tankGameAbi}__ and `eventName` set to `"Upgrade"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameUpgradeEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tankGameAbi,
    address: tankGameAddress,
    eventName: 'Upgrade',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tankGameAbi}__ and `eventName` set to `"Vote"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2c927e3b60586eb229Dcc55978Bc96A7E00Fb414)
 * -
 */
export const useTankGameVoteEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: tankGameAbi,
  address: tankGameAddress,
  eventName: 'Vote',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameFactoryAbi}__
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x9758ce8FE412C72893b42FFEdAEDff1840e1886f)
 * -
 */
export const useTankGameFactoryRead = /*#__PURE__*/ createUseReadContract({
  abi: tankGameFactoryAbi,
  address: tankGameFactoryAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameFactoryAbi}__ and `functionName` set to `"gameView"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x9758ce8FE412C72893b42FFEdAEDff1840e1886f)
 * -
 */
export const useTankGameFactoryGameView = /*#__PURE__*/ createUseReadContract({
  abi: tankGameFactoryAbi,
  address: tankGameFactoryAddress,
  functionName: 'gameView',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameFactoryAbi}__ and `functionName` set to `"hookFactory"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x9758ce8FE412C72893b42FFEdAEDff1840e1886f)
 * -
 */
export const useTankGameFactoryHookFactory =
  /*#__PURE__*/ createUseReadContract({
    abi: tankGameFactoryAbi,
    address: tankGameFactoryAddress,
    functionName: 'hookFactory',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tankGameFactoryAbi}__
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x9758ce8FE412C72893b42FFEdAEDff1840e1886f)
 * -
 */
export const useTankGameFactoryWrite = /*#__PURE__*/ createUseWriteContract({
  abi: tankGameFactoryAbi,
  address: tankGameFactoryAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tankGameFactoryAbi}__ and `functionName` set to `"createGame"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x9758ce8FE412C72893b42FFEdAEDff1840e1886f)
 * -
 */
export const useTankGameFactoryCreateGame =
  /*#__PURE__*/ createUseWriteContract({
    abi: tankGameFactoryAbi,
    address: tankGameFactoryAddress,
    functionName: 'createGame',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tankGameFactoryAbi}__
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x9758ce8FE412C72893b42FFEdAEDff1840e1886f)
 * -
 */
export const usePrepareTankGameFactoryWrite =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tankGameFactoryAbi,
    address: tankGameFactoryAddress,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tankGameFactoryAbi}__ and `functionName` set to `"createGame"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x9758ce8FE412C72893b42FFEdAEDff1840e1886f)
 * -
 */
export const usePrepareTankGameFactoryCreateGame =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tankGameFactoryAbi,
    address: tankGameFactoryAddress,
    functionName: 'createGame',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tankGameFactoryAbi}__
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x9758ce8FE412C72893b42FFEdAEDff1840e1886f)
 * -
 */
export const useTankGameFactoryEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tankGameFactoryAbi,
    address: tankGameFactoryAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tankGameFactoryAbi}__ and `eventName` set to `"GameCreated"`
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x9758ce8FE412C72893b42FFEdAEDff1840e1886f)
 * -
 */
export const useTankGameFactoryGameCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tankGameFactoryAbi,
    address: tankGameFactoryAddress,
    eventName: 'GameCreated',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameV2StorageAbi}__
 */
export const useTankGameV2StorageRead = /*#__PURE__*/ createUseReadContract({
  abi: tankGameV2StorageAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameV2StorageAbi}__ and `functionName` set to `"aliveTanksIdSum"`
 */
export const useTankGameV2StorageAliveTanksIdSum =
  /*#__PURE__*/ createUseReadContract({
    abi: tankGameV2StorageAbi,
    functionName: 'aliveTanksIdSum',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameV2StorageAbi}__ and `functionName` set to `"board"`
 */
export const useTankGameV2StorageBoard = /*#__PURE__*/ createUseReadContract({
  abi: tankGameV2StorageAbi,
  functionName: 'board',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameV2StorageAbi}__ and `functionName` set to `"claimed"`
 */
export const useTankGameV2StorageClaimed = /*#__PURE__*/ createUseReadContract({
  abi: tankGameV2StorageAbi,
  functionName: 'claimed',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameV2StorageAbi}__ and `functionName` set to `"deadTanks"`
 */
export const useTankGameV2StorageDeadTanks =
  /*#__PURE__*/ createUseReadContract({
    abi: tankGameV2StorageAbi,
    functionName: 'deadTanks',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameV2StorageAbi}__ and `functionName` set to `"delegates"`
 */
export const useTankGameV2StorageDelegates =
  /*#__PURE__*/ createUseReadContract({
    abi: tankGameV2StorageAbi,
    functionName: 'delegates',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameV2StorageAbi}__ and `functionName` set to `"epochStart"`
 */
export const useTankGameV2StorageEpochStart =
  /*#__PURE__*/ createUseReadContract({
    abi: tankGameV2StorageAbi,
    functionName: 'epochStart',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameV2StorageAbi}__ and `functionName` set to `"lastDripEpoch"`
 */
export const useTankGameV2StorageLastDripEpoch =
  /*#__PURE__*/ createUseReadContract({
    abi: tankGameV2StorageAbi,
    functionName: 'lastDripEpoch',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameV2StorageAbi}__ and `functionName` set to `"lastRevealBlock"`
 */
export const useTankGameV2StorageLastRevealBlock =
  /*#__PURE__*/ createUseReadContract({
    abi: tankGameV2StorageAbi,
    functionName: 'lastRevealBlock',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameV2StorageAbi}__ and `functionName` set to `"numTanksAlive"`
 */
export const useTankGameV2StorageNumTanksAlive =
  /*#__PURE__*/ createUseReadContract({
    abi: tankGameV2StorageAbi,
    functionName: 'numTanksAlive',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameV2StorageAbi}__ and `functionName` set to `"owner"`
 */
export const useTankGameV2StorageOwner = /*#__PURE__*/ createUseReadContract({
  abi: tankGameV2StorageAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameV2StorageAbi}__ and `functionName` set to `"players"`
 */
export const useTankGameV2StoragePlayers = /*#__PURE__*/ createUseReadContract({
  abi: tankGameV2StorageAbi,
  functionName: 'players',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameV2StorageAbi}__ and `functionName` set to `"playersCount"`
 */
export const useTankGameV2StoragePlayersCount =
  /*#__PURE__*/ createUseReadContract({
    abi: tankGameV2StorageAbi,
    functionName: 'playersCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameV2StorageAbi}__ and `functionName` set to `"podium"`
 */
export const useTankGameV2StoragePodium = /*#__PURE__*/ createUseReadContract({
  abi: tankGameV2StorageAbi,
  functionName: 'podium',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameV2StorageAbi}__ and `functionName` set to `"prizePool"`
 */
export const useTankGameV2StoragePrizePool =
  /*#__PURE__*/ createUseReadContract({
    abi: tankGameV2StorageAbi,
    functionName: 'prizePool',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameV2StorageAbi}__ and `functionName` set to `"revealBlock"`
 */
export const useTankGameV2StorageRevealBlock =
  /*#__PURE__*/ createUseReadContract({
    abi: tankGameV2StorageAbi,
    functionName: 'revealBlock',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameV2StorageAbi}__ and `functionName` set to `"settings"`
 */
export const useTankGameV2StorageSettings = /*#__PURE__*/ createUseReadContract(
  { abi: tankGameV2StorageAbi, functionName: 'settings' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameV2StorageAbi}__ and `functionName` set to `"state"`
 */
export const useTankGameV2StorageState = /*#__PURE__*/ createUseReadContract({
  abi: tankGameV2StorageAbi,
  functionName: 'state',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameV2StorageAbi}__ and `functionName` set to `"stateData"`
 */
export const useTankGameV2StorageStateData =
  /*#__PURE__*/ createUseReadContract({
    abi: tankGameV2StorageAbi,
    functionName: 'stateData',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameV2StorageAbi}__ and `functionName` set to `"tankHooks"`
 */
export const useTankGameV2StorageTankHooks =
  /*#__PURE__*/ createUseReadContract({
    abi: tankGameV2StorageAbi,
    functionName: 'tankHooks',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameV2StorageAbi}__ and `functionName` set to `"tanks"`
 */
export const useTankGameV2StorageTanks = /*#__PURE__*/ createUseReadContract({
  abi: tankGameV2StorageAbi,
  functionName: 'tanks',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameV2StorageAbi}__ and `functionName` set to `"votedThisEpoch"`
 */
export const useTankGameV2StorageVotedThisEpoch =
  /*#__PURE__*/ createUseReadContract({
    abi: tankGameV2StorageAbi,
    functionName: 'votedThisEpoch',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameV2StorageAbi}__ and `functionName` set to `"votesPerEpoch"`
 */
export const useTankGameV2StorageVotesPerEpoch =
  /*#__PURE__*/ createUseReadContract({
    abi: tankGameV2StorageAbi,
    functionName: 'votesPerEpoch',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tankGameV2StorageAbi}__ and `functionName` set to `"votingClosed"`
 */
export const useTankGameV2StorageVotingClosed =
  /*#__PURE__*/ createUseReadContract({
    abi: tankGameV2StorageAbi,
    functionName: 'votingClosed',
  })
