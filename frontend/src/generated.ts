import {
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  useContractEvent,
  UseContractEventConfig,
  useNetwork,
  useChainId,
  Address,
} from 'wagmi'
import {
  ReadContractResult,
  WriteContractMode,
  PrepareWriteContractResult,
} from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Board
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const boardABI = [
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

export const bountyABI = [
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
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Clones
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const clonesABI = [
  { type: 'error', inputs: [], name: 'ERC1167FailedCreateClone' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DefaultEmptyHooks
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const defaultEmptyHooksABI = [
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
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xAFf0E741b60288110bA7a400Ef6a99917faA593c)
 * -
 */
export const gameViewABI = [
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
    ],
    name: 'getUpgradeCost',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'game', internalType: 'address', type: 'address' },
      { name: 'tankId', internalType: 'uint256', type: 'uint256' },
      { name: '_owner', internalType: 'address', type: 'address' },
    ],
    name: 'isAuth',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
] as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xAFf0E741b60288110bA7a400Ef6a99917faA593c)
 * -
 */
export const gameViewAddress = {
  5: '0xAFf0E741b60288110bA7a400Ef6a99917faA593c',
  31337: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
} as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xAFf0E741b60288110bA7a400Ef6a99917faA593c)
 * -
 */
export const gameViewConfig = {
  address: gameViewAddress,
  abi: gameViewABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// HexBoard
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const hexBoardABI = [
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
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x1397a0540F1CA3604518483F534E83fbeB60beF6)
 * -
 */
export const hookFactoryABI = [
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
] as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x1397a0540F1CA3604518483F534E83fbeB60beF6)
 * -
 */
export const hookFactoryAddress = {
  5: '0x1397a0540F1CA3604518483F534E83fbeB60beF6',
  31337: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
} as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x1397a0540F1CA3604518483F534E83fbeB60beF6)
 * -
 */
export const hookFactoryConfig = {
  address: hookFactoryAddress,
  abi: hookFactoryABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IAcceptable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iAcceptableABI = [
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'hook', internalType: 'address', type: 'address' },
    ],
    name: 'accept',
    outputs: [],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IGameView
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iGameViewABI = [
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

export const iHooksABI = [
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

export const iMulticall3ABI = [
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
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export const iTankGameABI = [
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
] as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export const iTankGameAddress = {
  5: '0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743',
  31337: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
} as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export const iTankGameConfig = {
  address: iTankGameAddress,
  abi: iTankGameABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ITreaty
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iTreatyABI = [
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
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Math
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mathABI = [
  { type: 'error', inputs: [], name: 'MathOverflowedMulDiv' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MerkleProof
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const merkleProofABI = [
  { type: 'error', inputs: [], name: 'MerkleProofInvalidMultiproof' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NonAggression
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const nonAggressionABI = [
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
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NonAggressionHook
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const nonAggressionHookABI = [
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'hook', internalType: 'address', type: 'address' },
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
// Strings
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const stringsABI = [
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
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export const tankGameABI = [
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
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'position', internalType: 'uint256', type: 'uint256' }],
    name: 'heartsOnBoard',
    outputs: [{ name: 'heartCount', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [{ name: 'position', internalType: 'uint256', type: 'uint256' }],
    name: 'tanksOnBoard',
    outputs: [{ name: 'tankId', internalType: 'uint256', type: 'uint256' }],
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
] as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export const tankGameAddress = {
  5: '0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743',
  31337: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
} as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export const tankGameConfig = {
  address: tankGameAddress,
  abi: tankGameABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TankGameFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xaE9036AEB055Fd322dfeaBc53d927EE31ddCca08)
 * -
 */
export const tankGameFactoryABI = [
  { type: 'error', inputs: [], name: 'ERC1167FailedCreateClone' },
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
] as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xaE9036AEB055Fd322dfeaBc53d927EE31ddCca08)
 * -
 */
export const tankGameFactoryAddress = {
  5: '0xaE9036AEB055Fd322dfeaBc53d927EE31ddCca08',
  31337: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
} as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xaE9036AEB055Fd322dfeaBc53d927EE31ddCca08)
 * -
 */
export const tankGameFactoryConfig = {
  address: tankGameFactoryAddress,
  abi: tankGameFactoryABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TankGameLogic
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const tankGameLogicABI = [
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
    inputs: [],
    name: 'getBoard',
    outputs: [{ name: '', internalType: 'contract Board', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getEpoch',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [],
    name: 'getPlayerCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
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
          { name: 'root', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getState',
    outputs: [
      { name: '', internalType: 'enum ITankGame.GameState', type: 'uint8' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tankId', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [{ name: 'position', internalType: 'uint256', type: 'uint256' }],
    name: 'tanksOnBoard',
    outputs: [{ name: 'tankId', internalType: 'uint256', type: 'uint256' }],
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
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TankGameV2Storage
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const tankGameV2StorageABI = [
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
    inputs: [{ name: 'position', internalType: 'uint256', type: 'uint256' }],
    name: 'heartsOnBoard',
    outputs: [{ name: 'heartCount', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [{ name: 'position', internalType: 'uint256', type: 'uint256' }],
    name: 'tanksOnBoard',
    outputs: [{ name: 'tankId', internalType: 'uint256', type: 'uint256' }],
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
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link boardABI}__.
 */
export function useBoardRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof boardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({ abi: boardABI, ...config } as UseContractReadConfig<
    typeof boardABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link boardABI}__ and `functionName` set to `"boardSize"`.
 */
export function useBoardBoardSize<
  TFunctionName extends 'boardSize',
  TSelectData = ReadContractResult<typeof boardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: boardABI,
    functionName: 'boardSize',
    ...config,
  } as UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link boardABI}__ and `functionName` set to `"getDistance"`.
 */
export function useBoardGetDistance<
  TFunctionName extends 'getDistance',
  TSelectData = ReadContractResult<typeof boardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: boardABI,
    functionName: 'getDistance',
    ...config,
  } as UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link boardABI}__ and `functionName` set to `"getDistanceTankToPoint"`.
 */
export function useBoardGetDistanceTankToPoint<
  TFunctionName extends 'getDistanceTankToPoint',
  TSelectData = ReadContractResult<typeof boardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: boardABI,
    functionName: 'getDistanceTankToPoint',
    ...config,
  } as UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link boardABI}__ and `functionName` set to `"getDistanceTanks"`.
 */
export function useBoardGetDistanceTanks<
  TFunctionName extends 'getDistanceTanks',
  TSelectData = ReadContractResult<typeof boardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: boardABI,
    functionName: 'getDistanceTanks',
    ...config,
  } as UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link boardABI}__ and `functionName` set to `"getEmptyTile"`.
 */
export function useBoardGetEmptyTile<
  TFunctionName extends 'getEmptyTile',
  TSelectData = ReadContractResult<typeof boardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: boardABI,
    functionName: 'getEmptyTile',
    ...config,
  } as UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link boardABI}__ and `functionName` set to `"getHeartAtPosition"`.
 */
export function useBoardGetHeartAtPosition<
  TFunctionName extends 'getHeartAtPosition',
  TSelectData = ReadContractResult<typeof boardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: boardABI,
    functionName: 'getHeartAtPosition',
    ...config,
  } as UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link boardABI}__ and `functionName` set to `"getPerimeterForRadius"`.
 */
export function useBoardGetPerimeterForRadius<
  TFunctionName extends 'getPerimeterForRadius',
  TSelectData = ReadContractResult<typeof boardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: boardABI,
    functionName: 'getPerimeterForRadius',
    ...config,
  } as UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link boardABI}__ and `functionName` set to `"getTankPosition"`.
 */
export function useBoardGetTankPosition<
  TFunctionName extends 'getTankPosition',
  TSelectData = ReadContractResult<typeof boardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: boardABI,
    functionName: 'getTankPosition',
    ...config,
  } as UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link boardABI}__ and `functionName` set to `"getTile"`.
 */
export function useBoardGetTile<
  TFunctionName extends 'getTile',
  TSelectData = ReadContractResult<typeof boardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: boardABI,
    functionName: 'getTile',
    ...config,
  } as UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link boardABI}__ and `functionName` set to `"getTotalTiles"`.
 */
export function useBoardGetTotalTiles<
  TFunctionName extends 'getTotalTiles',
  TSelectData = ReadContractResult<typeof boardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: boardABI,
    functionName: 'getTotalTiles',
    ...config,
  } as UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link boardABI}__ and `functionName` set to `"isValidPoint"`.
 */
export function useBoardIsValidPoint<
  TFunctionName extends 'isValidPoint',
  TSelectData = ReadContractResult<typeof boardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: boardABI,
    functionName: 'isValidPoint',
    ...config,
  } as UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link boardABI}__ and `functionName` set to `"pointToIndex"`.
 */
export function useBoardPointToIndex<
  TFunctionName extends 'pointToIndex',
  TSelectData = ReadContractResult<typeof boardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: boardABI,
    functionName: 'pointToIndex',
    ...config,
  } as UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link boardABI}__ and `functionName` set to `"randomPoint"`.
 */
export function useBoardRandomPoint<
  TFunctionName extends 'randomPoint',
  TSelectData = ReadContractResult<typeof boardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: boardABI,
    functionName: 'randomPoint',
    ...config,
  } as UseContractReadConfig<typeof boardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link boardABI}__.
 */
export function useBoardWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof boardABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof boardABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof boardABI, TFunctionName, TMode>({
    abi: boardABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link boardABI}__ and `functionName` set to `"setTile"`.
 */
export function useBoardSetTile<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof boardABI,
          'setTile'
        >['request']['abi'],
        'setTile',
        TMode
      > & { functionName?: 'setTile' }
    : UseContractWriteConfig<typeof boardABI, 'setTile', TMode> & {
        abi?: never
        functionName?: 'setTile'
      } = {} as any,
) {
  return useContractWrite<typeof boardABI, 'setTile', TMode>({
    abi: boardABI,
    functionName: 'setTile',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link boardABI}__.
 */
export function usePrepareBoardWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof boardABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: boardABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof boardABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link boardABI}__ and `functionName` set to `"setTile"`.
 */
export function usePrepareBoardSetTile(
  config: Omit<
    UsePrepareContractWriteConfig<typeof boardABI, 'setTile'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: boardABI,
    functionName: 'setTile',
    ...config,
  } as UsePrepareContractWriteConfig<typeof boardABI, 'setTile'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bountyABI}__.
 */
export function useBountyRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof bountyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({ abi: bountyABI, ...config } as UseContractReadConfig<
    typeof bountyABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"afterClaim"`.
 */
export function useBountyAfterClaim<
  TFunctionName extends 'afterClaim',
  TSelectData = ReadContractResult<typeof bountyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bountyABI,
    functionName: 'afterClaim',
    ...config,
  } as UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"afterDelegate"`.
 */
export function useBountyAfterDelegate<
  TFunctionName extends 'afterDelegate',
  TSelectData = ReadContractResult<typeof bountyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bountyABI,
    functionName: 'afterDelegate',
    ...config,
  } as UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"afterDrip"`.
 */
export function useBountyAfterDrip<
  TFunctionName extends 'afterDrip',
  TSelectData = ReadContractResult<typeof bountyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bountyABI,
    functionName: 'afterDrip',
    ...config,
  } as UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"afterJoin"`.
 */
export function useBountyAfterJoin<
  TFunctionName extends 'afterJoin',
  TSelectData = ReadContractResult<typeof bountyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bountyABI,
    functionName: 'afterJoin',
    ...config,
  } as UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"beforeClaim"`.
 */
export function useBountyBeforeClaim<
  TFunctionName extends 'beforeClaim',
  TSelectData = ReadContractResult<typeof bountyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bountyABI,
    functionName: 'beforeClaim',
    ...config,
  } as UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"beforeDelegate"`.
 */
export function useBountyBeforeDelegate<
  TFunctionName extends 'beforeDelegate',
  TSelectData = ReadContractResult<typeof bountyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bountyABI,
    functionName: 'beforeDelegate',
    ...config,
  } as UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"beforeDrip"`.
 */
export function useBountyBeforeDrip<
  TFunctionName extends 'beforeDrip',
  TSelectData = ReadContractResult<typeof bountyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bountyABI,
    functionName: 'beforeDrip',
    ...config,
  } as UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"beforeGive"`.
 */
export function useBountyBeforeGive<
  TFunctionName extends 'beforeGive',
  TSelectData = ReadContractResult<typeof bountyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bountyABI,
    functionName: 'beforeGive',
    ...config,
  } as UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"beforeJoin"`.
 */
export function useBountyBeforeJoin<
  TFunctionName extends 'beforeJoin',
  TSelectData = ReadContractResult<typeof bountyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bountyABI,
    functionName: 'beforeJoin',
    ...config,
  } as UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"beforeReveal"`.
 */
export function useBountyBeforeReveal<
  TFunctionName extends 'beforeReveal',
  TSelectData = ReadContractResult<typeof bountyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bountyABI,
    functionName: 'beforeReveal',
    ...config,
  } as UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"bounties"`.
 */
export function useBountyBounties<
  TFunctionName extends 'bounties',
  TSelectData = ReadContractResult<typeof bountyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bountyABI,
    functionName: 'bounties',
    ...config,
  } as UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"bountiesData"`.
 */
export function useBountyBountiesData<
  TFunctionName extends 'bountiesData',
  TSelectData = ReadContractResult<typeof bountyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bountyABI,
    functionName: 'bountiesData',
    ...config,
  } as UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"bountyCount"`.
 */
export function useBountyBountyCount<
  TFunctionName extends 'bountyCount',
  TSelectData = ReadContractResult<typeof bountyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bountyABI,
    functionName: 'bountyCount',
    ...config,
  } as UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"ownerTank"`.
 */
export function useBountyOwnerTank<
  TFunctionName extends 'ownerTank',
  TSelectData = ReadContractResult<typeof bountyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bountyABI,
    functionName: 'ownerTank',
    ...config,
  } as UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"tankGame"`.
 */
export function useBountyTankGame<
  TFunctionName extends 'tankGame',
  TSelectData = ReadContractResult<typeof bountyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bountyABI,
    functionName: 'tankGame',
    ...config,
  } as UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"tankGameView"`.
 */
export function useBountyTankGameView<
  TFunctionName extends 'tankGameView',
  TSelectData = ReadContractResult<typeof bountyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bountyABI,
    functionName: 'tankGameView',
    ...config,
  } as UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"withdrawals"`.
 */
export function useBountyWithdrawals<
  TFunctionName extends 'withdrawals',
  TSelectData = ReadContractResult<typeof bountyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bountyABI,
    functionName: 'withdrawals',
    ...config,
  } as UseContractReadConfig<typeof bountyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bountyABI}__.
 */
export function useBountyWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof bountyABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof bountyABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof bountyABI, TFunctionName, TMode>({
    abi: bountyABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"afterGive"`.
 */
export function useBountyAfterGive<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bountyABI,
          'afterGive'
        >['request']['abi'],
        'afterGive',
        TMode
      > & { functionName?: 'afterGive' }
    : UseContractWriteConfig<typeof bountyABI, 'afterGive', TMode> & {
        abi?: never
        functionName?: 'afterGive'
      } = {} as any,
) {
  return useContractWrite<typeof bountyABI, 'afterGive', TMode>({
    abi: bountyABI,
    functionName: 'afterGive',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"afterMove"`.
 */
export function useBountyAfterMove<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bountyABI,
          'afterMove'
        >['request']['abi'],
        'afterMove',
        TMode
      > & { functionName?: 'afterMove' }
    : UseContractWriteConfig<typeof bountyABI, 'afterMove', TMode> & {
        abi?: never
        functionName?: 'afterMove'
      } = {} as any,
) {
  return useContractWrite<typeof bountyABI, 'afterMove', TMode>({
    abi: bountyABI,
    functionName: 'afterMove',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"afterReveal"`.
 */
export function useBountyAfterReveal<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bountyABI,
          'afterReveal'
        >['request']['abi'],
        'afterReveal',
        TMode
      > & { functionName?: 'afterReveal' }
    : UseContractWriteConfig<typeof bountyABI, 'afterReveal', TMode> & {
        abi?: never
        functionName?: 'afterReveal'
      } = {} as any,
) {
  return useContractWrite<typeof bountyABI, 'afterReveal', TMode>({
    abi: bountyABI,
    functionName: 'afterReveal',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"afterShoot"`.
 */
export function useBountyAfterShoot<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bountyABI,
          'afterShoot'
        >['request']['abi'],
        'afterShoot',
        TMode
      > & { functionName?: 'afterShoot' }
    : UseContractWriteConfig<typeof bountyABI, 'afterShoot', TMode> & {
        abi?: never
        functionName?: 'afterShoot'
      } = {} as any,
) {
  return useContractWrite<typeof bountyABI, 'afterShoot', TMode>({
    abi: bountyABI,
    functionName: 'afterShoot',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"afterUpgrade"`.
 */
export function useBountyAfterUpgrade<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bountyABI,
          'afterUpgrade'
        >['request']['abi'],
        'afterUpgrade',
        TMode
      > & { functionName?: 'afterUpgrade' }
    : UseContractWriteConfig<typeof bountyABI, 'afterUpgrade', TMode> & {
        abi?: never
        functionName?: 'afterUpgrade'
      } = {} as any,
) {
  return useContractWrite<typeof bountyABI, 'afterUpgrade', TMode>({
    abi: bountyABI,
    functionName: 'afterUpgrade',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"afterVote"`.
 */
export function useBountyAfterVote<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bountyABI,
          'afterVote'
        >['request']['abi'],
        'afterVote',
        TMode
      > & { functionName?: 'afterVote' }
    : UseContractWriteConfig<typeof bountyABI, 'afterVote', TMode> & {
        abi?: never
        functionName?: 'afterVote'
      } = {} as any,
) {
  return useContractWrite<typeof bountyABI, 'afterVote', TMode>({
    abi: bountyABI,
    functionName: 'afterVote',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"beforeMove"`.
 */
export function useBountyBeforeMove<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bountyABI,
          'beforeMove'
        >['request']['abi'],
        'beforeMove',
        TMode
      > & { functionName?: 'beforeMove' }
    : UseContractWriteConfig<typeof bountyABI, 'beforeMove', TMode> & {
        abi?: never
        functionName?: 'beforeMove'
      } = {} as any,
) {
  return useContractWrite<typeof bountyABI, 'beforeMove', TMode>({
    abi: bountyABI,
    functionName: 'beforeMove',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"beforeShoot"`.
 */
export function useBountyBeforeShoot<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bountyABI,
          'beforeShoot'
        >['request']['abi'],
        'beforeShoot',
        TMode
      > & { functionName?: 'beforeShoot' }
    : UseContractWriteConfig<typeof bountyABI, 'beforeShoot', TMode> & {
        abi?: never
        functionName?: 'beforeShoot'
      } = {} as any,
) {
  return useContractWrite<typeof bountyABI, 'beforeShoot', TMode>({
    abi: bountyABI,
    functionName: 'beforeShoot',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"beforeUpgrade"`.
 */
export function useBountyBeforeUpgrade<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bountyABI,
          'beforeUpgrade'
        >['request']['abi'],
        'beforeUpgrade',
        TMode
      > & { functionName?: 'beforeUpgrade' }
    : UseContractWriteConfig<typeof bountyABI, 'beforeUpgrade', TMode> & {
        abi?: never
        functionName?: 'beforeUpgrade'
      } = {} as any,
) {
  return useContractWrite<typeof bountyABI, 'beforeUpgrade', TMode>({
    abi: bountyABI,
    functionName: 'beforeUpgrade',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"beforeVote"`.
 */
export function useBountyBeforeVote<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bountyABI,
          'beforeVote'
        >['request']['abi'],
        'beforeVote',
        TMode
      > & { functionName?: 'beforeVote' }
    : UseContractWriteConfig<typeof bountyABI, 'beforeVote', TMode> & {
        abi?: never
        functionName?: 'beforeVote'
      } = {} as any,
) {
  return useContractWrite<typeof bountyABI, 'beforeVote', TMode>({
    abi: bountyABI,
    functionName: 'beforeVote',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"cancel"`.
 */
export function useBountyCancel<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bountyABI,
          'cancel'
        >['request']['abi'],
        'cancel',
        TMode
      > & { functionName?: 'cancel' }
    : UseContractWriteConfig<typeof bountyABI, 'cancel', TMode> & {
        abi?: never
        functionName?: 'cancel'
      } = {} as any,
) {
  return useContractWrite<typeof bountyABI, 'cancel', TMode>({
    abi: bountyABI,
    functionName: 'cancel',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"create"`.
 */
export function useBountyCreate<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bountyABI,
          'create'
        >['request']['abi'],
        'create',
        TMode
      > & { functionName?: 'create' }
    : UseContractWriteConfig<typeof bountyABI, 'create', TMode> & {
        abi?: never
        functionName?: 'create'
      } = {} as any,
) {
  return useContractWrite<typeof bountyABI, 'create', TMode>({
    abi: bountyABI,
    functionName: 'create',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"withdraw"`.
 */
export function useBountyWithdraw<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bountyABI,
          'withdraw'
        >['request']['abi'],
        'withdraw',
        TMode
      > & { functionName?: 'withdraw' }
    : UseContractWriteConfig<typeof bountyABI, 'withdraw', TMode> & {
        abi?: never
        functionName?: 'withdraw'
      } = {} as any,
) {
  return useContractWrite<typeof bountyABI, 'withdraw', TMode>({
    abi: bountyABI,
    functionName: 'withdraw',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bountyABI}__.
 */
export function usePrepareBountyWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bountyABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bountyABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof bountyABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"afterGive"`.
 */
export function usePrepareBountyAfterGive(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bountyABI, 'afterGive'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bountyABI,
    functionName: 'afterGive',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bountyABI, 'afterGive'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"afterMove"`.
 */
export function usePrepareBountyAfterMove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bountyABI, 'afterMove'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bountyABI,
    functionName: 'afterMove',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bountyABI, 'afterMove'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"afterReveal"`.
 */
export function usePrepareBountyAfterReveal(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bountyABI, 'afterReveal'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bountyABI,
    functionName: 'afterReveal',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bountyABI, 'afterReveal'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"afterShoot"`.
 */
export function usePrepareBountyAfterShoot(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bountyABI, 'afterShoot'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bountyABI,
    functionName: 'afterShoot',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bountyABI, 'afterShoot'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"afterUpgrade"`.
 */
export function usePrepareBountyAfterUpgrade(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bountyABI, 'afterUpgrade'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bountyABI,
    functionName: 'afterUpgrade',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bountyABI, 'afterUpgrade'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"afterVote"`.
 */
export function usePrepareBountyAfterVote(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bountyABI, 'afterVote'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bountyABI,
    functionName: 'afterVote',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bountyABI, 'afterVote'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"beforeMove"`.
 */
export function usePrepareBountyBeforeMove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bountyABI, 'beforeMove'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bountyABI,
    functionName: 'beforeMove',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bountyABI, 'beforeMove'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"beforeShoot"`.
 */
export function usePrepareBountyBeforeShoot(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bountyABI, 'beforeShoot'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bountyABI,
    functionName: 'beforeShoot',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bountyABI, 'beforeShoot'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"beforeUpgrade"`.
 */
export function usePrepareBountyBeforeUpgrade(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bountyABI, 'beforeUpgrade'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bountyABI,
    functionName: 'beforeUpgrade',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bountyABI, 'beforeUpgrade'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"beforeVote"`.
 */
export function usePrepareBountyBeforeVote(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bountyABI, 'beforeVote'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bountyABI,
    functionName: 'beforeVote',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bountyABI, 'beforeVote'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"cancel"`.
 */
export function usePrepareBountyCancel(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bountyABI, 'cancel'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bountyABI,
    functionName: 'cancel',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bountyABI, 'cancel'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"create"`.
 */
export function usePrepareBountyCreate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bountyABI, 'create'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bountyABI,
    functionName: 'create',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bountyABI, 'create'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bountyABI}__ and `functionName` set to `"withdraw"`.
 */
export function usePrepareBountyWithdraw(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bountyABI, 'withdraw'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bountyABI,
    functionName: 'withdraw',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bountyABI, 'withdraw'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link bountyABI}__.
 */
export function useBountyEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof bountyABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({
    abi: bountyABI,
    ...config,
  } as UseContractEventConfig<typeof bountyABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link bountyABI}__ and `eventName` set to `"BountyHookCreated"`.
 */
export function useBountyBountyHookCreatedEvent(
  config: Omit<
    UseContractEventConfig<typeof bountyABI, 'BountyHookCreated'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: bountyABI,
    eventName: 'BountyHookCreated',
    ...config,
  } as UseContractEventConfig<typeof bountyABI, 'BountyHookCreated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link bountyABI}__ and `eventName` set to `"BountyPosted"`.
 */
export function useBountyBountyPostedEvent(
  config: Omit<
    UseContractEventConfig<typeof bountyABI, 'BountyPosted'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: bountyABI,
    eventName: 'BountyPosted',
    ...config,
  } as UseContractEventConfig<typeof bountyABI, 'BountyPosted'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link bountyABI}__ and `eventName` set to `"BountyWon"`.
 */
export function useBountyBountyWonEvent(
  config: Omit<
    UseContractEventConfig<typeof bountyABI, 'BountyWon'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: bountyABI,
    eventName: 'BountyWon',
    ...config,
  } as UseContractEventConfig<typeof bountyABI, 'BountyWon'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link bountyABI}__ and `eventName` set to `"Withdraw"`.
 */
export function useBountyWithdrawEvent(
  config: Omit<
    UseContractEventConfig<typeof bountyABI, 'Withdraw'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: bountyABI,
    eventName: 'Withdraw',
    ...config,
  } as UseContractEventConfig<typeof bountyABI, 'Withdraw'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link defaultEmptyHooksABI}__.
 */
export function useDefaultEmptyHooksRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof defaultEmptyHooksABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof defaultEmptyHooksABI,
      TFunctionName,
      TSelectData
    >,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: defaultEmptyHooksABI,
    ...config,
  } as UseContractReadConfig<
    typeof defaultEmptyHooksABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"afterClaim"`.
 */
export function useDefaultEmptyHooksAfterClaim<
  TFunctionName extends 'afterClaim',
  TSelectData = ReadContractResult<typeof defaultEmptyHooksABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof defaultEmptyHooksABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: defaultEmptyHooksABI,
    functionName: 'afterClaim',
    ...config,
  } as UseContractReadConfig<
    typeof defaultEmptyHooksABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"afterDelegate"`.
 */
export function useDefaultEmptyHooksAfterDelegate<
  TFunctionName extends 'afterDelegate',
  TSelectData = ReadContractResult<typeof defaultEmptyHooksABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof defaultEmptyHooksABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: defaultEmptyHooksABI,
    functionName: 'afterDelegate',
    ...config,
  } as UseContractReadConfig<
    typeof defaultEmptyHooksABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"afterDrip"`.
 */
export function useDefaultEmptyHooksAfterDrip<
  TFunctionName extends 'afterDrip',
  TSelectData = ReadContractResult<typeof defaultEmptyHooksABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof defaultEmptyHooksABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: defaultEmptyHooksABI,
    functionName: 'afterDrip',
    ...config,
  } as UseContractReadConfig<
    typeof defaultEmptyHooksABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"afterJoin"`.
 */
export function useDefaultEmptyHooksAfterJoin<
  TFunctionName extends 'afterJoin',
  TSelectData = ReadContractResult<typeof defaultEmptyHooksABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof defaultEmptyHooksABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: defaultEmptyHooksABI,
    functionName: 'afterJoin',
    ...config,
  } as UseContractReadConfig<
    typeof defaultEmptyHooksABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"beforeClaim"`.
 */
export function useDefaultEmptyHooksBeforeClaim<
  TFunctionName extends 'beforeClaim',
  TSelectData = ReadContractResult<typeof defaultEmptyHooksABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof defaultEmptyHooksABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: defaultEmptyHooksABI,
    functionName: 'beforeClaim',
    ...config,
  } as UseContractReadConfig<
    typeof defaultEmptyHooksABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"beforeDelegate"`.
 */
export function useDefaultEmptyHooksBeforeDelegate<
  TFunctionName extends 'beforeDelegate',
  TSelectData = ReadContractResult<typeof defaultEmptyHooksABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof defaultEmptyHooksABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: defaultEmptyHooksABI,
    functionName: 'beforeDelegate',
    ...config,
  } as UseContractReadConfig<
    typeof defaultEmptyHooksABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"beforeDrip"`.
 */
export function useDefaultEmptyHooksBeforeDrip<
  TFunctionName extends 'beforeDrip',
  TSelectData = ReadContractResult<typeof defaultEmptyHooksABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof defaultEmptyHooksABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: defaultEmptyHooksABI,
    functionName: 'beforeDrip',
    ...config,
  } as UseContractReadConfig<
    typeof defaultEmptyHooksABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"beforeGive"`.
 */
export function useDefaultEmptyHooksBeforeGive<
  TFunctionName extends 'beforeGive',
  TSelectData = ReadContractResult<typeof defaultEmptyHooksABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof defaultEmptyHooksABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: defaultEmptyHooksABI,
    functionName: 'beforeGive',
    ...config,
  } as UseContractReadConfig<
    typeof defaultEmptyHooksABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"beforeJoin"`.
 */
export function useDefaultEmptyHooksBeforeJoin<
  TFunctionName extends 'beforeJoin',
  TSelectData = ReadContractResult<typeof defaultEmptyHooksABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof defaultEmptyHooksABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: defaultEmptyHooksABI,
    functionName: 'beforeJoin',
    ...config,
  } as UseContractReadConfig<
    typeof defaultEmptyHooksABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"beforeReveal"`.
 */
export function useDefaultEmptyHooksBeforeReveal<
  TFunctionName extends 'beforeReveal',
  TSelectData = ReadContractResult<typeof defaultEmptyHooksABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof defaultEmptyHooksABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: defaultEmptyHooksABI,
    functionName: 'beforeReveal',
    ...config,
  } as UseContractReadConfig<
    typeof defaultEmptyHooksABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link defaultEmptyHooksABI}__.
 */
export function useDefaultEmptyHooksWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof defaultEmptyHooksABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<
        typeof defaultEmptyHooksABI,
        TFunctionName,
        TMode
      > & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof defaultEmptyHooksABI, TFunctionName, TMode>({
    abi: defaultEmptyHooksABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"afterGive"`.
 */
export function useDefaultEmptyHooksAfterGive<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof defaultEmptyHooksABI,
          'afterGive'
        >['request']['abi'],
        'afterGive',
        TMode
      > & { functionName?: 'afterGive' }
    : UseContractWriteConfig<
        typeof defaultEmptyHooksABI,
        'afterGive',
        TMode
      > & {
        abi?: never
        functionName?: 'afterGive'
      } = {} as any,
) {
  return useContractWrite<typeof defaultEmptyHooksABI, 'afterGive', TMode>({
    abi: defaultEmptyHooksABI,
    functionName: 'afterGive',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"afterMove"`.
 */
export function useDefaultEmptyHooksAfterMove<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof defaultEmptyHooksABI,
          'afterMove'
        >['request']['abi'],
        'afterMove',
        TMode
      > & { functionName?: 'afterMove' }
    : UseContractWriteConfig<
        typeof defaultEmptyHooksABI,
        'afterMove',
        TMode
      > & {
        abi?: never
        functionName?: 'afterMove'
      } = {} as any,
) {
  return useContractWrite<typeof defaultEmptyHooksABI, 'afterMove', TMode>({
    abi: defaultEmptyHooksABI,
    functionName: 'afterMove',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"afterReveal"`.
 */
export function useDefaultEmptyHooksAfterReveal<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof defaultEmptyHooksABI,
          'afterReveal'
        >['request']['abi'],
        'afterReveal',
        TMode
      > & { functionName?: 'afterReveal' }
    : UseContractWriteConfig<
        typeof defaultEmptyHooksABI,
        'afterReveal',
        TMode
      > & {
        abi?: never
        functionName?: 'afterReveal'
      } = {} as any,
) {
  return useContractWrite<typeof defaultEmptyHooksABI, 'afterReveal', TMode>({
    abi: defaultEmptyHooksABI,
    functionName: 'afterReveal',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"afterShoot"`.
 */
export function useDefaultEmptyHooksAfterShoot<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof defaultEmptyHooksABI,
          'afterShoot'
        >['request']['abi'],
        'afterShoot',
        TMode
      > & { functionName?: 'afterShoot' }
    : UseContractWriteConfig<
        typeof defaultEmptyHooksABI,
        'afterShoot',
        TMode
      > & {
        abi?: never
        functionName?: 'afterShoot'
      } = {} as any,
) {
  return useContractWrite<typeof defaultEmptyHooksABI, 'afterShoot', TMode>({
    abi: defaultEmptyHooksABI,
    functionName: 'afterShoot',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"afterUpgrade"`.
 */
export function useDefaultEmptyHooksAfterUpgrade<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof defaultEmptyHooksABI,
          'afterUpgrade'
        >['request']['abi'],
        'afterUpgrade',
        TMode
      > & { functionName?: 'afterUpgrade' }
    : UseContractWriteConfig<
        typeof defaultEmptyHooksABI,
        'afterUpgrade',
        TMode
      > & {
        abi?: never
        functionName?: 'afterUpgrade'
      } = {} as any,
) {
  return useContractWrite<typeof defaultEmptyHooksABI, 'afterUpgrade', TMode>({
    abi: defaultEmptyHooksABI,
    functionName: 'afterUpgrade',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"afterVote"`.
 */
export function useDefaultEmptyHooksAfterVote<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof defaultEmptyHooksABI,
          'afterVote'
        >['request']['abi'],
        'afterVote',
        TMode
      > & { functionName?: 'afterVote' }
    : UseContractWriteConfig<
        typeof defaultEmptyHooksABI,
        'afterVote',
        TMode
      > & {
        abi?: never
        functionName?: 'afterVote'
      } = {} as any,
) {
  return useContractWrite<typeof defaultEmptyHooksABI, 'afterVote', TMode>({
    abi: defaultEmptyHooksABI,
    functionName: 'afterVote',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"beforeMove"`.
 */
export function useDefaultEmptyHooksBeforeMove<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof defaultEmptyHooksABI,
          'beforeMove'
        >['request']['abi'],
        'beforeMove',
        TMode
      > & { functionName?: 'beforeMove' }
    : UseContractWriteConfig<
        typeof defaultEmptyHooksABI,
        'beforeMove',
        TMode
      > & {
        abi?: never
        functionName?: 'beforeMove'
      } = {} as any,
) {
  return useContractWrite<typeof defaultEmptyHooksABI, 'beforeMove', TMode>({
    abi: defaultEmptyHooksABI,
    functionName: 'beforeMove',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"beforeShoot"`.
 */
export function useDefaultEmptyHooksBeforeShoot<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof defaultEmptyHooksABI,
          'beforeShoot'
        >['request']['abi'],
        'beforeShoot',
        TMode
      > & { functionName?: 'beforeShoot' }
    : UseContractWriteConfig<
        typeof defaultEmptyHooksABI,
        'beforeShoot',
        TMode
      > & {
        abi?: never
        functionName?: 'beforeShoot'
      } = {} as any,
) {
  return useContractWrite<typeof defaultEmptyHooksABI, 'beforeShoot', TMode>({
    abi: defaultEmptyHooksABI,
    functionName: 'beforeShoot',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"beforeUpgrade"`.
 */
export function useDefaultEmptyHooksBeforeUpgrade<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof defaultEmptyHooksABI,
          'beforeUpgrade'
        >['request']['abi'],
        'beforeUpgrade',
        TMode
      > & { functionName?: 'beforeUpgrade' }
    : UseContractWriteConfig<
        typeof defaultEmptyHooksABI,
        'beforeUpgrade',
        TMode
      > & {
        abi?: never
        functionName?: 'beforeUpgrade'
      } = {} as any,
) {
  return useContractWrite<typeof defaultEmptyHooksABI, 'beforeUpgrade', TMode>({
    abi: defaultEmptyHooksABI,
    functionName: 'beforeUpgrade',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"beforeVote"`.
 */
export function useDefaultEmptyHooksBeforeVote<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof defaultEmptyHooksABI,
          'beforeVote'
        >['request']['abi'],
        'beforeVote',
        TMode
      > & { functionName?: 'beforeVote' }
    : UseContractWriteConfig<
        typeof defaultEmptyHooksABI,
        'beforeVote',
        TMode
      > & {
        abi?: never
        functionName?: 'beforeVote'
      } = {} as any,
) {
  return useContractWrite<typeof defaultEmptyHooksABI, 'beforeVote', TMode>({
    abi: defaultEmptyHooksABI,
    functionName: 'beforeVote',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link defaultEmptyHooksABI}__.
 */
export function usePrepareDefaultEmptyHooksWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof defaultEmptyHooksABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: defaultEmptyHooksABI,
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof defaultEmptyHooksABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"afterGive"`.
 */
export function usePrepareDefaultEmptyHooksAfterGive(
  config: Omit<
    UsePrepareContractWriteConfig<typeof defaultEmptyHooksABI, 'afterGive'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: defaultEmptyHooksABI,
    functionName: 'afterGive',
    ...config,
  } as UsePrepareContractWriteConfig<typeof defaultEmptyHooksABI, 'afterGive'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"afterMove"`.
 */
export function usePrepareDefaultEmptyHooksAfterMove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof defaultEmptyHooksABI, 'afterMove'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: defaultEmptyHooksABI,
    functionName: 'afterMove',
    ...config,
  } as UsePrepareContractWriteConfig<typeof defaultEmptyHooksABI, 'afterMove'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"afterReveal"`.
 */
export function usePrepareDefaultEmptyHooksAfterReveal(
  config: Omit<
    UsePrepareContractWriteConfig<typeof defaultEmptyHooksABI, 'afterReveal'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: defaultEmptyHooksABI,
    functionName: 'afterReveal',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof defaultEmptyHooksABI,
    'afterReveal'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"afterShoot"`.
 */
export function usePrepareDefaultEmptyHooksAfterShoot(
  config: Omit<
    UsePrepareContractWriteConfig<typeof defaultEmptyHooksABI, 'afterShoot'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: defaultEmptyHooksABI,
    functionName: 'afterShoot',
    ...config,
  } as UsePrepareContractWriteConfig<typeof defaultEmptyHooksABI, 'afterShoot'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"afterUpgrade"`.
 */
export function usePrepareDefaultEmptyHooksAfterUpgrade(
  config: Omit<
    UsePrepareContractWriteConfig<typeof defaultEmptyHooksABI, 'afterUpgrade'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: defaultEmptyHooksABI,
    functionName: 'afterUpgrade',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof defaultEmptyHooksABI,
    'afterUpgrade'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"afterVote"`.
 */
export function usePrepareDefaultEmptyHooksAfterVote(
  config: Omit<
    UsePrepareContractWriteConfig<typeof defaultEmptyHooksABI, 'afterVote'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: defaultEmptyHooksABI,
    functionName: 'afterVote',
    ...config,
  } as UsePrepareContractWriteConfig<typeof defaultEmptyHooksABI, 'afterVote'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"beforeMove"`.
 */
export function usePrepareDefaultEmptyHooksBeforeMove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof defaultEmptyHooksABI, 'beforeMove'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: defaultEmptyHooksABI,
    functionName: 'beforeMove',
    ...config,
  } as UsePrepareContractWriteConfig<typeof defaultEmptyHooksABI, 'beforeMove'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"beforeShoot"`.
 */
export function usePrepareDefaultEmptyHooksBeforeShoot(
  config: Omit<
    UsePrepareContractWriteConfig<typeof defaultEmptyHooksABI, 'beforeShoot'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: defaultEmptyHooksABI,
    functionName: 'beforeShoot',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof defaultEmptyHooksABI,
    'beforeShoot'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"beforeUpgrade"`.
 */
export function usePrepareDefaultEmptyHooksBeforeUpgrade(
  config: Omit<
    UsePrepareContractWriteConfig<typeof defaultEmptyHooksABI, 'beforeUpgrade'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: defaultEmptyHooksABI,
    functionName: 'beforeUpgrade',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof defaultEmptyHooksABI,
    'beforeUpgrade'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link defaultEmptyHooksABI}__ and `functionName` set to `"beforeVote"`.
 */
export function usePrepareDefaultEmptyHooksBeforeVote(
  config: Omit<
    UsePrepareContractWriteConfig<typeof defaultEmptyHooksABI, 'beforeVote'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: defaultEmptyHooksABI,
    functionName: 'beforeVote',
    ...config,
  } as UsePrepareContractWriteConfig<typeof defaultEmptyHooksABI, 'beforeVote'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gameViewABI}__.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xAFf0E741b60288110bA7a400Ef6a99917faA593c)
 * -
 */
export function useGameViewRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof gameViewABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof gameViewABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof gameViewAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: gameViewABI,
    address: gameViewAddress[chainId as keyof typeof gameViewAddress],
    ...config,
  } as UseContractReadConfig<typeof gameViewABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gameViewABI}__ and `functionName` set to `"getAllHearts"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xAFf0E741b60288110bA7a400Ef6a99917faA593c)
 * -
 */
export function useGameViewGetAllHearts<
  TFunctionName extends 'getAllHearts',
  TSelectData = ReadContractResult<typeof gameViewABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof gameViewABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof gameViewAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: gameViewABI,
    address: gameViewAddress[chainId as keyof typeof gameViewAddress],
    functionName: 'getAllHearts',
    ...config,
  } as UseContractReadConfig<typeof gameViewABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gameViewABI}__ and `functionName` set to `"getAllTanks"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xAFf0E741b60288110bA7a400Ef6a99917faA593c)
 * -
 */
export function useGameViewGetAllTanks<
  TFunctionName extends 'getAllTanks',
  TSelectData = ReadContractResult<typeof gameViewABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof gameViewABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof gameViewAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: gameViewABI,
    address: gameViewAddress[chainId as keyof typeof gameViewAddress],
    functionName: 'getAllTanks',
    ...config,
  } as UseContractReadConfig<typeof gameViewABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gameViewABI}__ and `functionName` set to `"getBoard"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xAFf0E741b60288110bA7a400Ef6a99917faA593c)
 * -
 */
export function useGameViewGetBoard<
  TFunctionName extends 'getBoard',
  TSelectData = ReadContractResult<typeof gameViewABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof gameViewABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof gameViewAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: gameViewABI,
    address: gameViewAddress[chainId as keyof typeof gameViewAddress],
    functionName: 'getBoard',
    ...config,
  } as UseContractReadConfig<typeof gameViewABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gameViewABI}__ and `functionName` set to `"getEpoch"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xAFf0E741b60288110bA7a400Ef6a99917faA593c)
 * -
 */
export function useGameViewGetEpoch<
  TFunctionName extends 'getEpoch',
  TSelectData = ReadContractResult<typeof gameViewABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof gameViewABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof gameViewAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: gameViewABI,
    address: gameViewAddress[chainId as keyof typeof gameViewAddress],
    functionName: 'getEpoch',
    ...config,
  } as UseContractReadConfig<typeof gameViewABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gameViewABI}__ and `functionName` set to `"getGameEpoch"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xAFf0E741b60288110bA7a400Ef6a99917faA593c)
 * -
 */
export function useGameViewGetGameEpoch<
  TFunctionName extends 'getGameEpoch',
  TSelectData = ReadContractResult<typeof gameViewABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof gameViewABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof gameViewAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: gameViewABI,
    address: gameViewAddress[chainId as keyof typeof gameViewAddress],
    functionName: 'getGameEpoch',
    ...config,
  } as UseContractReadConfig<typeof gameViewABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gameViewABI}__ and `functionName` set to `"getLastDrip"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xAFf0E741b60288110bA7a400Ef6a99917faA593c)
 * -
 */
export function useGameViewGetLastDrip<
  TFunctionName extends 'getLastDrip',
  TSelectData = ReadContractResult<typeof gameViewABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof gameViewABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof gameViewAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: gameViewABI,
    address: gameViewAddress[chainId as keyof typeof gameViewAddress],
    functionName: 'getLastDrip',
    ...config,
  } as UseContractReadConfig<typeof gameViewABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gameViewABI}__ and `functionName` set to `"getPlayerCount"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xAFf0E741b60288110bA7a400Ef6a99917faA593c)
 * -
 */
export function useGameViewGetPlayerCount<
  TFunctionName extends 'getPlayerCount',
  TSelectData = ReadContractResult<typeof gameViewABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof gameViewABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof gameViewAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: gameViewABI,
    address: gameViewAddress[chainId as keyof typeof gameViewAddress],
    functionName: 'getPlayerCount',
    ...config,
  } as UseContractReadConfig<typeof gameViewABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gameViewABI}__ and `functionName` set to `"getSettings"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xAFf0E741b60288110bA7a400Ef6a99917faA593c)
 * -
 */
export function useGameViewGetSettings<
  TFunctionName extends 'getSettings',
  TSelectData = ReadContractResult<typeof gameViewABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof gameViewABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof gameViewAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: gameViewABI,
    address: gameViewAddress[chainId as keyof typeof gameViewAddress],
    functionName: 'getSettings',
    ...config,
  } as UseContractReadConfig<typeof gameViewABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gameViewABI}__ and `functionName` set to `"getState"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xAFf0E741b60288110bA7a400Ef6a99917faA593c)
 * -
 */
export function useGameViewGetState<
  TFunctionName extends 'getState',
  TSelectData = ReadContractResult<typeof gameViewABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof gameViewABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof gameViewAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: gameViewABI,
    address: gameViewAddress[chainId as keyof typeof gameViewAddress],
    functionName: 'getState',
    ...config,
  } as UseContractReadConfig<typeof gameViewABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gameViewABI}__ and `functionName` set to `"getTank"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xAFf0E741b60288110bA7a400Ef6a99917faA593c)
 * -
 */
export function useGameViewGetTank<
  TFunctionName extends 'getTank',
  TSelectData = ReadContractResult<typeof gameViewABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof gameViewABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof gameViewAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: gameViewABI,
    address: gameViewAddress[chainId as keyof typeof gameViewAddress],
    functionName: 'getTank',
    ...config,
  } as UseContractReadConfig<typeof gameViewABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gameViewABI}__ and `functionName` set to `"getUpgradeCost"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xAFf0E741b60288110bA7a400Ef6a99917faA593c)
 * -
 */
export function useGameViewGetUpgradeCost<
  TFunctionName extends 'getUpgradeCost',
  TSelectData = ReadContractResult<typeof gameViewABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof gameViewABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof gameViewAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: gameViewABI,
    address: gameViewAddress[chainId as keyof typeof gameViewAddress],
    functionName: 'getUpgradeCost',
    ...config,
  } as UseContractReadConfig<typeof gameViewABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link gameViewABI}__ and `functionName` set to `"isAuth"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xAFf0E741b60288110bA7a400Ef6a99917faA593c)
 * -
 */
export function useGameViewIsAuth<
  TFunctionName extends 'isAuth',
  TSelectData = ReadContractResult<typeof gameViewABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof gameViewABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof gameViewAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: gameViewABI,
    address: gameViewAddress[chainId as keyof typeof gameViewAddress],
    functionName: 'isAuth',
    ...config,
  } as UseContractReadConfig<typeof gameViewABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link hexBoardABI}__.
 */
export function useHexBoardRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof hexBoardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: hexBoardABI,
    ...config,
  } as UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link hexBoardABI}__ and `functionName` set to `"boardSize"`.
 */
export function useHexBoardBoardSize<
  TFunctionName extends 'boardSize',
  TSelectData = ReadContractResult<typeof hexBoardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: hexBoardABI,
    functionName: 'boardSize',
    ...config,
  } as UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link hexBoardABI}__ and `functionName` set to `"getDistance"`.
 */
export function useHexBoardGetDistance<
  TFunctionName extends 'getDistance',
  TSelectData = ReadContractResult<typeof hexBoardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: hexBoardABI,
    functionName: 'getDistance',
    ...config,
  } as UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link hexBoardABI}__ and `functionName` set to `"getDistanceTankToPoint"`.
 */
export function useHexBoardGetDistanceTankToPoint<
  TFunctionName extends 'getDistanceTankToPoint',
  TSelectData = ReadContractResult<typeof hexBoardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: hexBoardABI,
    functionName: 'getDistanceTankToPoint',
    ...config,
  } as UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link hexBoardABI}__ and `functionName` set to `"getDistanceTanks"`.
 */
export function useHexBoardGetDistanceTanks<
  TFunctionName extends 'getDistanceTanks',
  TSelectData = ReadContractResult<typeof hexBoardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: hexBoardABI,
    functionName: 'getDistanceTanks',
    ...config,
  } as UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link hexBoardABI}__ and `functionName` set to `"getEmptyTile"`.
 */
export function useHexBoardGetEmptyTile<
  TFunctionName extends 'getEmptyTile',
  TSelectData = ReadContractResult<typeof hexBoardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: hexBoardABI,
    functionName: 'getEmptyTile',
    ...config,
  } as UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link hexBoardABI}__ and `functionName` set to `"getHeartAtPosition"`.
 */
export function useHexBoardGetHeartAtPosition<
  TFunctionName extends 'getHeartAtPosition',
  TSelectData = ReadContractResult<typeof hexBoardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: hexBoardABI,
    functionName: 'getHeartAtPosition',
    ...config,
  } as UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link hexBoardABI}__ and `functionName` set to `"getPerimeterForRadius"`.
 */
export function useHexBoardGetPerimeterForRadius<
  TFunctionName extends 'getPerimeterForRadius',
  TSelectData = ReadContractResult<typeof hexBoardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: hexBoardABI,
    functionName: 'getPerimeterForRadius',
    ...config,
  } as UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link hexBoardABI}__ and `functionName` set to `"getTankPosition"`.
 */
export function useHexBoardGetTankPosition<
  TFunctionName extends 'getTankPosition',
  TSelectData = ReadContractResult<typeof hexBoardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: hexBoardABI,
    functionName: 'getTankPosition',
    ...config,
  } as UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link hexBoardABI}__ and `functionName` set to `"getTile"`.
 */
export function useHexBoardGetTile<
  TFunctionName extends 'getTile',
  TSelectData = ReadContractResult<typeof hexBoardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: hexBoardABI,
    functionName: 'getTile',
    ...config,
  } as UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link hexBoardABI}__ and `functionName` set to `"getTotalTiles"`.
 */
export function useHexBoardGetTotalTiles<
  TFunctionName extends 'getTotalTiles',
  TSelectData = ReadContractResult<typeof hexBoardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: hexBoardABI,
    functionName: 'getTotalTiles',
    ...config,
  } as UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link hexBoardABI}__ and `functionName` set to `"heartsOnBoard"`.
 */
export function useHexBoardHeartsOnBoard<
  TFunctionName extends 'heartsOnBoard',
  TSelectData = ReadContractResult<typeof hexBoardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: hexBoardABI,
    functionName: 'heartsOnBoard',
    ...config,
  } as UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link hexBoardABI}__ and `functionName` set to `"isValidPoint"`.
 */
export function useHexBoardIsValidPoint<
  TFunctionName extends 'isValidPoint',
  TSelectData = ReadContractResult<typeof hexBoardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: hexBoardABI,
    functionName: 'isValidPoint',
    ...config,
  } as UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link hexBoardABI}__ and `functionName` set to `"pointToIndex"`.
 */
export function useHexBoardPointToIndex<
  TFunctionName extends 'pointToIndex',
  TSelectData = ReadContractResult<typeof hexBoardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: hexBoardABI,
    functionName: 'pointToIndex',
    ...config,
  } as UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link hexBoardABI}__ and `functionName` set to `"randomPoint"`.
 */
export function useHexBoardRandomPoint<
  TFunctionName extends 'randomPoint',
  TSelectData = ReadContractResult<typeof hexBoardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: hexBoardABI,
    functionName: 'randomPoint',
    ...config,
  } as UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link hexBoardABI}__ and `functionName` set to `"tankToPosition"`.
 */
export function useHexBoardTankToPosition<
  TFunctionName extends 'tankToPosition',
  TSelectData = ReadContractResult<typeof hexBoardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: hexBoardABI,
    functionName: 'tankToPosition',
    ...config,
  } as UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link hexBoardABI}__ and `functionName` set to `"tanksOnBoard"`.
 */
export function useHexBoardTanksOnBoard<
  TFunctionName extends 'tanksOnBoard',
  TSelectData = ReadContractResult<typeof hexBoardABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: hexBoardABI,
    functionName: 'tanksOnBoard',
    ...config,
  } as UseContractReadConfig<typeof hexBoardABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link hexBoardABI}__.
 */
export function useHexBoardWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof hexBoardABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof hexBoardABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof hexBoardABI, TFunctionName, TMode>({
    abi: hexBoardABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link hexBoardABI}__ and `functionName` set to `"setTile"`.
 */
export function useHexBoardSetTile<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof hexBoardABI,
          'setTile'
        >['request']['abi'],
        'setTile',
        TMode
      > & { functionName?: 'setTile' }
    : UseContractWriteConfig<typeof hexBoardABI, 'setTile', TMode> & {
        abi?: never
        functionName?: 'setTile'
      } = {} as any,
) {
  return useContractWrite<typeof hexBoardABI, 'setTile', TMode>({
    abi: hexBoardABI,
    functionName: 'setTile',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link hexBoardABI}__.
 */
export function usePrepareHexBoardWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof hexBoardABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: hexBoardABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof hexBoardABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link hexBoardABI}__ and `functionName` set to `"setTile"`.
 */
export function usePrepareHexBoardSetTile(
  config: Omit<
    UsePrepareContractWriteConfig<typeof hexBoardABI, 'setTile'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: hexBoardABI,
    functionName: 'setTile',
    ...config,
  } as UsePrepareContractWriteConfig<typeof hexBoardABI, 'setTile'>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link hookFactoryABI}__.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x1397a0540F1CA3604518483F534E83fbeB60beF6)
 * -
 */
export function useHookFactoryWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof hookFactoryAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof hookFactoryABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof hookFactoryABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof hookFactoryABI, TFunctionName, TMode>({
    abi: hookFactoryABI,
    address: hookFactoryAddress[chainId as keyof typeof hookFactoryAddress],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link hookFactoryABI}__ and `functionName` set to `"createHook"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x1397a0540F1CA3604518483F534E83fbeB60beF6)
 * -
 */
export function useHookFactoryCreateHook<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof hookFactoryAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof hookFactoryABI,
          'createHook'
        >['request']['abi'],
        'createHook',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'createHook' }
    : UseContractWriteConfig<typeof hookFactoryABI, 'createHook', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'createHook'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof hookFactoryABI, 'createHook', TMode>({
    abi: hookFactoryABI,
    address: hookFactoryAddress[chainId as keyof typeof hookFactoryAddress],
    functionName: 'createHook',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link hookFactoryABI}__.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x1397a0540F1CA3604518483F534E83fbeB60beF6)
 * -
 */
export function usePrepareHookFactoryWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof hookFactoryABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof hookFactoryAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: hookFactoryABI,
    address: hookFactoryAddress[chainId as keyof typeof hookFactoryAddress],
    ...config,
  } as UsePrepareContractWriteConfig<typeof hookFactoryABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link hookFactoryABI}__ and `functionName` set to `"createHook"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x1397a0540F1CA3604518483F534E83fbeB60beF6)
 * -
 */
export function usePrepareHookFactoryCreateHook(
  config: Omit<
    UsePrepareContractWriteConfig<typeof hookFactoryABI, 'createHook'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof hookFactoryAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: hookFactoryABI,
    address: hookFactoryAddress[chainId as keyof typeof hookFactoryAddress],
    functionName: 'createHook',
    ...config,
  } as UsePrepareContractWriteConfig<typeof hookFactoryABI, 'createHook'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link hookFactoryABI}__.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x1397a0540F1CA3604518483F534E83fbeB60beF6)
 * -
 */
export function useHookFactoryEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof hookFactoryABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof hookFactoryAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: hookFactoryABI,
    address: hookFactoryAddress[chainId as keyof typeof hookFactoryAddress],
    ...config,
  } as UseContractEventConfig<typeof hookFactoryABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link hookFactoryABI}__ and `eventName` set to `"HookCreated"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x1397a0540F1CA3604518483F534E83fbeB60beF6)
 * -
 */
export function useHookFactoryHookCreatedEvent(
  config: Omit<
    UseContractEventConfig<typeof hookFactoryABI, 'HookCreated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof hookFactoryAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: hookFactoryABI,
    address: hookFactoryAddress[chainId as keyof typeof hookFactoryAddress],
    eventName: 'HookCreated',
    ...config,
  } as UseContractEventConfig<typeof hookFactoryABI, 'HookCreated'>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iAcceptableABI}__.
 */
export function useIAcceptableWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iAcceptableABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof iAcceptableABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof iAcceptableABI, TFunctionName, TMode>({
    abi: iAcceptableABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iAcceptableABI}__ and `functionName` set to `"accept"`.
 */
export function useIAcceptableAccept<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iAcceptableABI,
          'accept'
        >['request']['abi'],
        'accept',
        TMode
      > & { functionName?: 'accept' }
    : UseContractWriteConfig<typeof iAcceptableABI, 'accept', TMode> & {
        abi?: never
        functionName?: 'accept'
      } = {} as any,
) {
  return useContractWrite<typeof iAcceptableABI, 'accept', TMode>({
    abi: iAcceptableABI,
    functionName: 'accept',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iAcceptableABI}__.
 */
export function usePrepareIAcceptableWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iAcceptableABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iAcceptableABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof iAcceptableABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iAcceptableABI}__ and `functionName` set to `"accept"`.
 */
export function usePrepareIAcceptableAccept(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iAcceptableABI, 'accept'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iAcceptableABI,
    functionName: 'accept',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iAcceptableABI, 'accept'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link iGameViewABI}__.
 */
export function useIGameViewRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof iGameViewABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof iGameViewABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: iGameViewABI,
    ...config,
  } as UseContractReadConfig<typeof iGameViewABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link iGameViewABI}__ and `functionName` set to `"getAllHearts"`.
 */
export function useIGameViewGetAllHearts<
  TFunctionName extends 'getAllHearts',
  TSelectData = ReadContractResult<typeof iGameViewABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof iGameViewABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: iGameViewABI,
    functionName: 'getAllHearts',
    ...config,
  } as UseContractReadConfig<typeof iGameViewABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link iGameViewABI}__ and `functionName` set to `"getAllTanks"`.
 */
export function useIGameViewGetAllTanks<
  TFunctionName extends 'getAllTanks',
  TSelectData = ReadContractResult<typeof iGameViewABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof iGameViewABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: iGameViewABI,
    functionName: 'getAllTanks',
    ...config,
  } as UseContractReadConfig<typeof iGameViewABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link iGameViewABI}__ and `functionName` set to `"getBoard"`.
 */
export function useIGameViewGetBoard<
  TFunctionName extends 'getBoard',
  TSelectData = ReadContractResult<typeof iGameViewABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof iGameViewABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: iGameViewABI,
    functionName: 'getBoard',
    ...config,
  } as UseContractReadConfig<typeof iGameViewABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link iGameViewABI}__ and `functionName` set to `"getEpoch"`.
 */
export function useIGameViewGetEpoch<
  TFunctionName extends 'getEpoch',
  TSelectData = ReadContractResult<typeof iGameViewABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof iGameViewABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: iGameViewABI,
    functionName: 'getEpoch',
    ...config,
  } as UseContractReadConfig<typeof iGameViewABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link iGameViewABI}__ and `functionName` set to `"getGameEpoch"`.
 */
export function useIGameViewGetGameEpoch<
  TFunctionName extends 'getGameEpoch',
  TSelectData = ReadContractResult<typeof iGameViewABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof iGameViewABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: iGameViewABI,
    functionName: 'getGameEpoch',
    ...config,
  } as UseContractReadConfig<typeof iGameViewABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link iGameViewABI}__ and `functionName` set to `"getLastDrip"`.
 */
export function useIGameViewGetLastDrip<
  TFunctionName extends 'getLastDrip',
  TSelectData = ReadContractResult<typeof iGameViewABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof iGameViewABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: iGameViewABI,
    functionName: 'getLastDrip',
    ...config,
  } as UseContractReadConfig<typeof iGameViewABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link iGameViewABI}__ and `functionName` set to `"getPlayerCount"`.
 */
export function useIGameViewGetPlayerCount<
  TFunctionName extends 'getPlayerCount',
  TSelectData = ReadContractResult<typeof iGameViewABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof iGameViewABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: iGameViewABI,
    functionName: 'getPlayerCount',
    ...config,
  } as UseContractReadConfig<typeof iGameViewABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link iGameViewABI}__ and `functionName` set to `"getSettings"`.
 */
export function useIGameViewGetSettings<
  TFunctionName extends 'getSettings',
  TSelectData = ReadContractResult<typeof iGameViewABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof iGameViewABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: iGameViewABI,
    functionName: 'getSettings',
    ...config,
  } as UseContractReadConfig<typeof iGameViewABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link iGameViewABI}__ and `functionName` set to `"getState"`.
 */
export function useIGameViewGetState<
  TFunctionName extends 'getState',
  TSelectData = ReadContractResult<typeof iGameViewABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof iGameViewABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: iGameViewABI,
    functionName: 'getState',
    ...config,
  } as UseContractReadConfig<typeof iGameViewABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link iGameViewABI}__ and `functionName` set to `"getTank"`.
 */
export function useIGameViewGetTank<
  TFunctionName extends 'getTank',
  TSelectData = ReadContractResult<typeof iGameViewABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof iGameViewABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: iGameViewABI,
    functionName: 'getTank',
    ...config,
  } as UseContractReadConfig<typeof iGameViewABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link iGameViewABI}__ and `functionName` set to `"isAuth"`.
 */
export function useIGameViewIsAuth<
  TFunctionName extends 'isAuth',
  TSelectData = ReadContractResult<typeof iGameViewABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof iGameViewABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: iGameViewABI,
    functionName: 'isAuth',
    ...config,
  } as UseContractReadConfig<typeof iGameViewABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iHooksABI}__.
 */
export function useIHooksWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof iHooksABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof iHooksABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof iHooksABI, TFunctionName, TMode>({
    abi: iHooksABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"afterClaim"`.
 */
export function useIHooksAfterClaim<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iHooksABI,
          'afterClaim'
        >['request']['abi'],
        'afterClaim',
        TMode
      > & { functionName?: 'afterClaim' }
    : UseContractWriteConfig<typeof iHooksABI, 'afterClaim', TMode> & {
        abi?: never
        functionName?: 'afterClaim'
      } = {} as any,
) {
  return useContractWrite<typeof iHooksABI, 'afterClaim', TMode>({
    abi: iHooksABI,
    functionName: 'afterClaim',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"afterDelegate"`.
 */
export function useIHooksAfterDelegate<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iHooksABI,
          'afterDelegate'
        >['request']['abi'],
        'afterDelegate',
        TMode
      > & { functionName?: 'afterDelegate' }
    : UseContractWriteConfig<typeof iHooksABI, 'afterDelegate', TMode> & {
        abi?: never
        functionName?: 'afterDelegate'
      } = {} as any,
) {
  return useContractWrite<typeof iHooksABI, 'afterDelegate', TMode>({
    abi: iHooksABI,
    functionName: 'afterDelegate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"afterDrip"`.
 */
export function useIHooksAfterDrip<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iHooksABI,
          'afterDrip'
        >['request']['abi'],
        'afterDrip',
        TMode
      > & { functionName?: 'afterDrip' }
    : UseContractWriteConfig<typeof iHooksABI, 'afterDrip', TMode> & {
        abi?: never
        functionName?: 'afterDrip'
      } = {} as any,
) {
  return useContractWrite<typeof iHooksABI, 'afterDrip', TMode>({
    abi: iHooksABI,
    functionName: 'afterDrip',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"afterGive"`.
 */
export function useIHooksAfterGive<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iHooksABI,
          'afterGive'
        >['request']['abi'],
        'afterGive',
        TMode
      > & { functionName?: 'afterGive' }
    : UseContractWriteConfig<typeof iHooksABI, 'afterGive', TMode> & {
        abi?: never
        functionName?: 'afterGive'
      } = {} as any,
) {
  return useContractWrite<typeof iHooksABI, 'afterGive', TMode>({
    abi: iHooksABI,
    functionName: 'afterGive',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"afterJoin"`.
 */
export function useIHooksAfterJoin<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iHooksABI,
          'afterJoin'
        >['request']['abi'],
        'afterJoin',
        TMode
      > & { functionName?: 'afterJoin' }
    : UseContractWriteConfig<typeof iHooksABI, 'afterJoin', TMode> & {
        abi?: never
        functionName?: 'afterJoin'
      } = {} as any,
) {
  return useContractWrite<typeof iHooksABI, 'afterJoin', TMode>({
    abi: iHooksABI,
    functionName: 'afterJoin',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"afterMove"`.
 */
export function useIHooksAfterMove<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iHooksABI,
          'afterMove'
        >['request']['abi'],
        'afterMove',
        TMode
      > & { functionName?: 'afterMove' }
    : UseContractWriteConfig<typeof iHooksABI, 'afterMove', TMode> & {
        abi?: never
        functionName?: 'afterMove'
      } = {} as any,
) {
  return useContractWrite<typeof iHooksABI, 'afterMove', TMode>({
    abi: iHooksABI,
    functionName: 'afterMove',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"afterReveal"`.
 */
export function useIHooksAfterReveal<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iHooksABI,
          'afterReveal'
        >['request']['abi'],
        'afterReveal',
        TMode
      > & { functionName?: 'afterReveal' }
    : UseContractWriteConfig<typeof iHooksABI, 'afterReveal', TMode> & {
        abi?: never
        functionName?: 'afterReveal'
      } = {} as any,
) {
  return useContractWrite<typeof iHooksABI, 'afterReveal', TMode>({
    abi: iHooksABI,
    functionName: 'afterReveal',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"afterShoot"`.
 */
export function useIHooksAfterShoot<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iHooksABI,
          'afterShoot'
        >['request']['abi'],
        'afterShoot',
        TMode
      > & { functionName?: 'afterShoot' }
    : UseContractWriteConfig<typeof iHooksABI, 'afterShoot', TMode> & {
        abi?: never
        functionName?: 'afterShoot'
      } = {} as any,
) {
  return useContractWrite<typeof iHooksABI, 'afterShoot', TMode>({
    abi: iHooksABI,
    functionName: 'afterShoot',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"afterUpgrade"`.
 */
export function useIHooksAfterUpgrade<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iHooksABI,
          'afterUpgrade'
        >['request']['abi'],
        'afterUpgrade',
        TMode
      > & { functionName?: 'afterUpgrade' }
    : UseContractWriteConfig<typeof iHooksABI, 'afterUpgrade', TMode> & {
        abi?: never
        functionName?: 'afterUpgrade'
      } = {} as any,
) {
  return useContractWrite<typeof iHooksABI, 'afterUpgrade', TMode>({
    abi: iHooksABI,
    functionName: 'afterUpgrade',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"afterVote"`.
 */
export function useIHooksAfterVote<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iHooksABI,
          'afterVote'
        >['request']['abi'],
        'afterVote',
        TMode
      > & { functionName?: 'afterVote' }
    : UseContractWriteConfig<typeof iHooksABI, 'afterVote', TMode> & {
        abi?: never
        functionName?: 'afterVote'
      } = {} as any,
) {
  return useContractWrite<typeof iHooksABI, 'afterVote', TMode>({
    abi: iHooksABI,
    functionName: 'afterVote',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"beforeClaim"`.
 */
export function useIHooksBeforeClaim<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iHooksABI,
          'beforeClaim'
        >['request']['abi'],
        'beforeClaim',
        TMode
      > & { functionName?: 'beforeClaim' }
    : UseContractWriteConfig<typeof iHooksABI, 'beforeClaim', TMode> & {
        abi?: never
        functionName?: 'beforeClaim'
      } = {} as any,
) {
  return useContractWrite<typeof iHooksABI, 'beforeClaim', TMode>({
    abi: iHooksABI,
    functionName: 'beforeClaim',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"beforeDelegate"`.
 */
export function useIHooksBeforeDelegate<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iHooksABI,
          'beforeDelegate'
        >['request']['abi'],
        'beforeDelegate',
        TMode
      > & { functionName?: 'beforeDelegate' }
    : UseContractWriteConfig<typeof iHooksABI, 'beforeDelegate', TMode> & {
        abi?: never
        functionName?: 'beforeDelegate'
      } = {} as any,
) {
  return useContractWrite<typeof iHooksABI, 'beforeDelegate', TMode>({
    abi: iHooksABI,
    functionName: 'beforeDelegate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"beforeDrip"`.
 */
export function useIHooksBeforeDrip<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iHooksABI,
          'beforeDrip'
        >['request']['abi'],
        'beforeDrip',
        TMode
      > & { functionName?: 'beforeDrip' }
    : UseContractWriteConfig<typeof iHooksABI, 'beforeDrip', TMode> & {
        abi?: never
        functionName?: 'beforeDrip'
      } = {} as any,
) {
  return useContractWrite<typeof iHooksABI, 'beforeDrip', TMode>({
    abi: iHooksABI,
    functionName: 'beforeDrip',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"beforeGive"`.
 */
export function useIHooksBeforeGive<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iHooksABI,
          'beforeGive'
        >['request']['abi'],
        'beforeGive',
        TMode
      > & { functionName?: 'beforeGive' }
    : UseContractWriteConfig<typeof iHooksABI, 'beforeGive', TMode> & {
        abi?: never
        functionName?: 'beforeGive'
      } = {} as any,
) {
  return useContractWrite<typeof iHooksABI, 'beforeGive', TMode>({
    abi: iHooksABI,
    functionName: 'beforeGive',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"beforeJoin"`.
 */
export function useIHooksBeforeJoin<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iHooksABI,
          'beforeJoin'
        >['request']['abi'],
        'beforeJoin',
        TMode
      > & { functionName?: 'beforeJoin' }
    : UseContractWriteConfig<typeof iHooksABI, 'beforeJoin', TMode> & {
        abi?: never
        functionName?: 'beforeJoin'
      } = {} as any,
) {
  return useContractWrite<typeof iHooksABI, 'beforeJoin', TMode>({
    abi: iHooksABI,
    functionName: 'beforeJoin',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"beforeMove"`.
 */
export function useIHooksBeforeMove<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iHooksABI,
          'beforeMove'
        >['request']['abi'],
        'beforeMove',
        TMode
      > & { functionName?: 'beforeMove' }
    : UseContractWriteConfig<typeof iHooksABI, 'beforeMove', TMode> & {
        abi?: never
        functionName?: 'beforeMove'
      } = {} as any,
) {
  return useContractWrite<typeof iHooksABI, 'beforeMove', TMode>({
    abi: iHooksABI,
    functionName: 'beforeMove',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"beforeReveal"`.
 */
export function useIHooksBeforeReveal<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iHooksABI,
          'beforeReveal'
        >['request']['abi'],
        'beforeReveal',
        TMode
      > & { functionName?: 'beforeReveal' }
    : UseContractWriteConfig<typeof iHooksABI, 'beforeReveal', TMode> & {
        abi?: never
        functionName?: 'beforeReveal'
      } = {} as any,
) {
  return useContractWrite<typeof iHooksABI, 'beforeReveal', TMode>({
    abi: iHooksABI,
    functionName: 'beforeReveal',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"beforeShoot"`.
 */
export function useIHooksBeforeShoot<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iHooksABI,
          'beforeShoot'
        >['request']['abi'],
        'beforeShoot',
        TMode
      > & { functionName?: 'beforeShoot' }
    : UseContractWriteConfig<typeof iHooksABI, 'beforeShoot', TMode> & {
        abi?: never
        functionName?: 'beforeShoot'
      } = {} as any,
) {
  return useContractWrite<typeof iHooksABI, 'beforeShoot', TMode>({
    abi: iHooksABI,
    functionName: 'beforeShoot',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"beforeUpgrade"`.
 */
export function useIHooksBeforeUpgrade<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iHooksABI,
          'beforeUpgrade'
        >['request']['abi'],
        'beforeUpgrade',
        TMode
      > & { functionName?: 'beforeUpgrade' }
    : UseContractWriteConfig<typeof iHooksABI, 'beforeUpgrade', TMode> & {
        abi?: never
        functionName?: 'beforeUpgrade'
      } = {} as any,
) {
  return useContractWrite<typeof iHooksABI, 'beforeUpgrade', TMode>({
    abi: iHooksABI,
    functionName: 'beforeUpgrade',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"beforeVote"`.
 */
export function useIHooksBeforeVote<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iHooksABI,
          'beforeVote'
        >['request']['abi'],
        'beforeVote',
        TMode
      > & { functionName?: 'beforeVote' }
    : UseContractWriteConfig<typeof iHooksABI, 'beforeVote', TMode> & {
        abi?: never
        functionName?: 'beforeVote'
      } = {} as any,
) {
  return useContractWrite<typeof iHooksABI, 'beforeVote', TMode>({
    abi: iHooksABI,
    functionName: 'beforeVote',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iHooksABI}__.
 */
export function usePrepareIHooksWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iHooksABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iHooksABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof iHooksABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"afterClaim"`.
 */
export function usePrepareIHooksAfterClaim(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iHooksABI, 'afterClaim'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iHooksABI,
    functionName: 'afterClaim',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iHooksABI, 'afterClaim'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"afterDelegate"`.
 */
export function usePrepareIHooksAfterDelegate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iHooksABI, 'afterDelegate'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iHooksABI,
    functionName: 'afterDelegate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iHooksABI, 'afterDelegate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"afterDrip"`.
 */
export function usePrepareIHooksAfterDrip(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iHooksABI, 'afterDrip'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iHooksABI,
    functionName: 'afterDrip',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iHooksABI, 'afterDrip'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"afterGive"`.
 */
export function usePrepareIHooksAfterGive(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iHooksABI, 'afterGive'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iHooksABI,
    functionName: 'afterGive',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iHooksABI, 'afterGive'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"afterJoin"`.
 */
export function usePrepareIHooksAfterJoin(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iHooksABI, 'afterJoin'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iHooksABI,
    functionName: 'afterJoin',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iHooksABI, 'afterJoin'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"afterMove"`.
 */
export function usePrepareIHooksAfterMove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iHooksABI, 'afterMove'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iHooksABI,
    functionName: 'afterMove',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iHooksABI, 'afterMove'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"afterReveal"`.
 */
export function usePrepareIHooksAfterReveal(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iHooksABI, 'afterReveal'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iHooksABI,
    functionName: 'afterReveal',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iHooksABI, 'afterReveal'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"afterShoot"`.
 */
export function usePrepareIHooksAfterShoot(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iHooksABI, 'afterShoot'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iHooksABI,
    functionName: 'afterShoot',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iHooksABI, 'afterShoot'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"afterUpgrade"`.
 */
export function usePrepareIHooksAfterUpgrade(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iHooksABI, 'afterUpgrade'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iHooksABI,
    functionName: 'afterUpgrade',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iHooksABI, 'afterUpgrade'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"afterVote"`.
 */
export function usePrepareIHooksAfterVote(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iHooksABI, 'afterVote'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iHooksABI,
    functionName: 'afterVote',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iHooksABI, 'afterVote'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"beforeClaim"`.
 */
export function usePrepareIHooksBeforeClaim(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iHooksABI, 'beforeClaim'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iHooksABI,
    functionName: 'beforeClaim',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iHooksABI, 'beforeClaim'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"beforeDelegate"`.
 */
export function usePrepareIHooksBeforeDelegate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iHooksABI, 'beforeDelegate'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iHooksABI,
    functionName: 'beforeDelegate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iHooksABI, 'beforeDelegate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"beforeDrip"`.
 */
export function usePrepareIHooksBeforeDrip(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iHooksABI, 'beforeDrip'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iHooksABI,
    functionName: 'beforeDrip',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iHooksABI, 'beforeDrip'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"beforeGive"`.
 */
export function usePrepareIHooksBeforeGive(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iHooksABI, 'beforeGive'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iHooksABI,
    functionName: 'beforeGive',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iHooksABI, 'beforeGive'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"beforeJoin"`.
 */
export function usePrepareIHooksBeforeJoin(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iHooksABI, 'beforeJoin'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iHooksABI,
    functionName: 'beforeJoin',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iHooksABI, 'beforeJoin'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"beforeMove"`.
 */
export function usePrepareIHooksBeforeMove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iHooksABI, 'beforeMove'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iHooksABI,
    functionName: 'beforeMove',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iHooksABI, 'beforeMove'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"beforeReveal"`.
 */
export function usePrepareIHooksBeforeReveal(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iHooksABI, 'beforeReveal'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iHooksABI,
    functionName: 'beforeReveal',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iHooksABI, 'beforeReveal'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"beforeShoot"`.
 */
export function usePrepareIHooksBeforeShoot(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iHooksABI, 'beforeShoot'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iHooksABI,
    functionName: 'beforeShoot',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iHooksABI, 'beforeShoot'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"beforeUpgrade"`.
 */
export function usePrepareIHooksBeforeUpgrade(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iHooksABI, 'beforeUpgrade'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iHooksABI,
    functionName: 'beforeUpgrade',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iHooksABI, 'beforeUpgrade'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iHooksABI}__ and `functionName` set to `"beforeVote"`.
 */
export function usePrepareIHooksBeforeVote(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iHooksABI, 'beforeVote'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iHooksABI,
    functionName: 'beforeVote',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iHooksABI, 'beforeVote'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link iMulticall3ABI}__.
 */
export function useIMulticall3Read<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof iMulticall3ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof iMulticall3ABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: iMulticall3ABI,
    ...config,
  } as UseContractReadConfig<typeof iMulticall3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link iMulticall3ABI}__ and `functionName` set to `"getBasefee"`.
 */
export function useIMulticall3GetBasefee<
  TFunctionName extends 'getBasefee',
  TSelectData = ReadContractResult<typeof iMulticall3ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof iMulticall3ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: iMulticall3ABI,
    functionName: 'getBasefee',
    ...config,
  } as UseContractReadConfig<typeof iMulticall3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link iMulticall3ABI}__ and `functionName` set to `"getBlockHash"`.
 */
export function useIMulticall3GetBlockHash<
  TFunctionName extends 'getBlockHash',
  TSelectData = ReadContractResult<typeof iMulticall3ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof iMulticall3ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: iMulticall3ABI,
    functionName: 'getBlockHash',
    ...config,
  } as UseContractReadConfig<typeof iMulticall3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link iMulticall3ABI}__ and `functionName` set to `"getBlockNumber"`.
 */
export function useIMulticall3GetBlockNumber<
  TFunctionName extends 'getBlockNumber',
  TSelectData = ReadContractResult<typeof iMulticall3ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof iMulticall3ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: iMulticall3ABI,
    functionName: 'getBlockNumber',
    ...config,
  } as UseContractReadConfig<typeof iMulticall3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link iMulticall3ABI}__ and `functionName` set to `"getChainId"`.
 */
export function useIMulticall3GetChainId<
  TFunctionName extends 'getChainId',
  TSelectData = ReadContractResult<typeof iMulticall3ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof iMulticall3ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: iMulticall3ABI,
    functionName: 'getChainId',
    ...config,
  } as UseContractReadConfig<typeof iMulticall3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link iMulticall3ABI}__ and `functionName` set to `"getCurrentBlockCoinbase"`.
 */
export function useIMulticall3GetCurrentBlockCoinbase<
  TFunctionName extends 'getCurrentBlockCoinbase',
  TSelectData = ReadContractResult<typeof iMulticall3ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof iMulticall3ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: iMulticall3ABI,
    functionName: 'getCurrentBlockCoinbase',
    ...config,
  } as UseContractReadConfig<typeof iMulticall3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link iMulticall3ABI}__ and `functionName` set to `"getCurrentBlockDifficulty"`.
 */
export function useIMulticall3GetCurrentBlockDifficulty<
  TFunctionName extends 'getCurrentBlockDifficulty',
  TSelectData = ReadContractResult<typeof iMulticall3ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof iMulticall3ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: iMulticall3ABI,
    functionName: 'getCurrentBlockDifficulty',
    ...config,
  } as UseContractReadConfig<typeof iMulticall3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link iMulticall3ABI}__ and `functionName` set to `"getCurrentBlockGasLimit"`.
 */
export function useIMulticall3GetCurrentBlockGasLimit<
  TFunctionName extends 'getCurrentBlockGasLimit',
  TSelectData = ReadContractResult<typeof iMulticall3ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof iMulticall3ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: iMulticall3ABI,
    functionName: 'getCurrentBlockGasLimit',
    ...config,
  } as UseContractReadConfig<typeof iMulticall3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link iMulticall3ABI}__ and `functionName` set to `"getCurrentBlockTimestamp"`.
 */
export function useIMulticall3GetCurrentBlockTimestamp<
  TFunctionName extends 'getCurrentBlockTimestamp',
  TSelectData = ReadContractResult<typeof iMulticall3ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof iMulticall3ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: iMulticall3ABI,
    functionName: 'getCurrentBlockTimestamp',
    ...config,
  } as UseContractReadConfig<typeof iMulticall3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link iMulticall3ABI}__ and `functionName` set to `"getEthBalance"`.
 */
export function useIMulticall3GetEthBalance<
  TFunctionName extends 'getEthBalance',
  TSelectData = ReadContractResult<typeof iMulticall3ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof iMulticall3ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: iMulticall3ABI,
    functionName: 'getEthBalance',
    ...config,
  } as UseContractReadConfig<typeof iMulticall3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link iMulticall3ABI}__ and `functionName` set to `"getLastBlockHash"`.
 */
export function useIMulticall3GetLastBlockHash<
  TFunctionName extends 'getLastBlockHash',
  TSelectData = ReadContractResult<typeof iMulticall3ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof iMulticall3ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: iMulticall3ABI,
    functionName: 'getLastBlockHash',
    ...config,
  } as UseContractReadConfig<typeof iMulticall3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iMulticall3ABI}__.
 */
export function useIMulticall3Write<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iMulticall3ABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof iMulticall3ABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof iMulticall3ABI, TFunctionName, TMode>({
    abi: iMulticall3ABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iMulticall3ABI}__ and `functionName` set to `"aggregate"`.
 */
export function useIMulticall3Aggregate<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iMulticall3ABI,
          'aggregate'
        >['request']['abi'],
        'aggregate',
        TMode
      > & { functionName?: 'aggregate' }
    : UseContractWriteConfig<typeof iMulticall3ABI, 'aggregate', TMode> & {
        abi?: never
        functionName?: 'aggregate'
      } = {} as any,
) {
  return useContractWrite<typeof iMulticall3ABI, 'aggregate', TMode>({
    abi: iMulticall3ABI,
    functionName: 'aggregate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iMulticall3ABI}__ and `functionName` set to `"aggregate3"`.
 */
export function useIMulticall3Aggregate3<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iMulticall3ABI,
          'aggregate3'
        >['request']['abi'],
        'aggregate3',
        TMode
      > & { functionName?: 'aggregate3' }
    : UseContractWriteConfig<typeof iMulticall3ABI, 'aggregate3', TMode> & {
        abi?: never
        functionName?: 'aggregate3'
      } = {} as any,
) {
  return useContractWrite<typeof iMulticall3ABI, 'aggregate3', TMode>({
    abi: iMulticall3ABI,
    functionName: 'aggregate3',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iMulticall3ABI}__ and `functionName` set to `"aggregate3Value"`.
 */
export function useIMulticall3Aggregate3Value<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iMulticall3ABI,
          'aggregate3Value'
        >['request']['abi'],
        'aggregate3Value',
        TMode
      > & { functionName?: 'aggregate3Value' }
    : UseContractWriteConfig<
        typeof iMulticall3ABI,
        'aggregate3Value',
        TMode
      > & {
        abi?: never
        functionName?: 'aggregate3Value'
      } = {} as any,
) {
  return useContractWrite<typeof iMulticall3ABI, 'aggregate3Value', TMode>({
    abi: iMulticall3ABI,
    functionName: 'aggregate3Value',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iMulticall3ABI}__ and `functionName` set to `"blockAndAggregate"`.
 */
export function useIMulticall3BlockAndAggregate<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iMulticall3ABI,
          'blockAndAggregate'
        >['request']['abi'],
        'blockAndAggregate',
        TMode
      > & { functionName?: 'blockAndAggregate' }
    : UseContractWriteConfig<
        typeof iMulticall3ABI,
        'blockAndAggregate',
        TMode
      > & {
        abi?: never
        functionName?: 'blockAndAggregate'
      } = {} as any,
) {
  return useContractWrite<typeof iMulticall3ABI, 'blockAndAggregate', TMode>({
    abi: iMulticall3ABI,
    functionName: 'blockAndAggregate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iMulticall3ABI}__ and `functionName` set to `"tryAggregate"`.
 */
export function useIMulticall3TryAggregate<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iMulticall3ABI,
          'tryAggregate'
        >['request']['abi'],
        'tryAggregate',
        TMode
      > & { functionName?: 'tryAggregate' }
    : UseContractWriteConfig<typeof iMulticall3ABI, 'tryAggregate', TMode> & {
        abi?: never
        functionName?: 'tryAggregate'
      } = {} as any,
) {
  return useContractWrite<typeof iMulticall3ABI, 'tryAggregate', TMode>({
    abi: iMulticall3ABI,
    functionName: 'tryAggregate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iMulticall3ABI}__ and `functionName` set to `"tryBlockAndAggregate"`.
 */
export function useIMulticall3TryBlockAndAggregate<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iMulticall3ABI,
          'tryBlockAndAggregate'
        >['request']['abi'],
        'tryBlockAndAggregate',
        TMode
      > & { functionName?: 'tryBlockAndAggregate' }
    : UseContractWriteConfig<
        typeof iMulticall3ABI,
        'tryBlockAndAggregate',
        TMode
      > & {
        abi?: never
        functionName?: 'tryBlockAndAggregate'
      } = {} as any,
) {
  return useContractWrite<typeof iMulticall3ABI, 'tryBlockAndAggregate', TMode>(
    {
      abi: iMulticall3ABI,
      functionName: 'tryBlockAndAggregate',
      ...config,
    } as any,
  )
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iMulticall3ABI}__.
 */
export function usePrepareIMulticall3Write<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iMulticall3ABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iMulticall3ABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof iMulticall3ABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iMulticall3ABI}__ and `functionName` set to `"aggregate"`.
 */
export function usePrepareIMulticall3Aggregate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iMulticall3ABI, 'aggregate'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iMulticall3ABI,
    functionName: 'aggregate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iMulticall3ABI, 'aggregate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iMulticall3ABI}__ and `functionName` set to `"aggregate3"`.
 */
export function usePrepareIMulticall3Aggregate3(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iMulticall3ABI, 'aggregate3'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iMulticall3ABI,
    functionName: 'aggregate3',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iMulticall3ABI, 'aggregate3'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iMulticall3ABI}__ and `functionName` set to `"aggregate3Value"`.
 */
export function usePrepareIMulticall3Aggregate3Value(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iMulticall3ABI, 'aggregate3Value'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iMulticall3ABI,
    functionName: 'aggregate3Value',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iMulticall3ABI, 'aggregate3Value'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iMulticall3ABI}__ and `functionName` set to `"blockAndAggregate"`.
 */
export function usePrepareIMulticall3BlockAndAggregate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iMulticall3ABI, 'blockAndAggregate'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iMulticall3ABI,
    functionName: 'blockAndAggregate',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof iMulticall3ABI,
    'blockAndAggregate'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iMulticall3ABI}__ and `functionName` set to `"tryAggregate"`.
 */
export function usePrepareIMulticall3TryAggregate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iMulticall3ABI, 'tryAggregate'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iMulticall3ABI,
    functionName: 'tryAggregate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iMulticall3ABI, 'tryAggregate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iMulticall3ABI}__ and `functionName` set to `"tryBlockAndAggregate"`.
 */
export function usePrepareIMulticall3TryBlockAndAggregate(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof iMulticall3ABI,
      'tryBlockAndAggregate'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iMulticall3ABI,
    functionName: 'tryBlockAndAggregate',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof iMulticall3ABI,
    'tryBlockAndAggregate'
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iTankGameABI}__.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof iTankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iTankGameABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof iTankGameABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof iTankGameABI, TFunctionName, TMode>({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iTankGameABI}__ and `functionName` set to `"addHooks"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameAddHooks<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof iTankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iTankGameABI,
          'addHooks'
        >['request']['abi'],
        'addHooks',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'addHooks' }
    : UseContractWriteConfig<typeof iTankGameABI, 'addHooks', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'addHooks'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof iTankGameABI, 'addHooks', TMode>({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    functionName: 'addHooks',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iTankGameABI}__ and `functionName` set to `"claim"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameClaim<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof iTankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iTankGameABI,
          'claim'
        >['request']['abi'],
        'claim',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'claim' }
    : UseContractWriteConfig<typeof iTankGameABI, 'claim', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'claim'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof iTankGameABI, 'claim', TMode>({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    functionName: 'claim',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iTankGameABI}__ and `functionName` set to `"delegate"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameDelegate<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof iTankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iTankGameABI,
          'delegate'
        >['request']['abi'],
        'delegate',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'delegate' }
    : UseContractWriteConfig<typeof iTankGameABI, 'delegate', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'delegate'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof iTankGameABI, 'delegate', TMode>({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    functionName: 'delegate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iTankGameABI}__ and `functionName` set to `"drip"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameDrip<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof iTankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iTankGameABI,
          'drip'
        >['request']['abi'],
        'drip',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'drip' }
    : UseContractWriteConfig<typeof iTankGameABI, 'drip', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'drip'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof iTankGameABI, 'drip', TMode>({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    functionName: 'drip',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iTankGameABI}__ and `functionName` set to `"give"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameGive<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof iTankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iTankGameABI,
          'give'
        >['request']['abi'],
        'give',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'give' }
    : UseContractWriteConfig<typeof iTankGameABI, 'give', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'give'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof iTankGameABI, 'give', TMode>({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    functionName: 'give',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iTankGameABI}__ and `functionName` set to `"initialize"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameInitialize<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof iTankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iTankGameABI,
          'initialize'
        >['request']['abi'],
        'initialize',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'initialize' }
    : UseContractWriteConfig<typeof iTankGameABI, 'initialize', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'initialize'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof iTankGameABI, 'initialize', TMode>({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    functionName: 'initialize',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iTankGameABI}__ and `functionName` set to `"join"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameJoin<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof iTankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iTankGameABI,
          'join'
        >['request']['abi'],
        'join',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'join' }
    : UseContractWriteConfig<typeof iTankGameABI, 'join', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'join'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof iTankGameABI, 'join', TMode>({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    functionName: 'join',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iTankGameABI}__ and `functionName` set to `"move"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameMove<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof iTankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iTankGameABI,
          'move'
        >['request']['abi'],
        'move',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'move' }
    : UseContractWriteConfig<typeof iTankGameABI, 'move', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'move'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof iTankGameABI, 'move', TMode>({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    functionName: 'move',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iTankGameABI}__ and `functionName` set to `"reveal"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameReveal<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof iTankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iTankGameABI,
          'reveal'
        >['request']['abi'],
        'reveal',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'reveal' }
    : UseContractWriteConfig<typeof iTankGameABI, 'reveal', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'reveal'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof iTankGameABI, 'reveal', TMode>({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    functionName: 'reveal',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iTankGameABI}__ and `functionName` set to `"shoot"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameShoot<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof iTankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iTankGameABI,
          'shoot'
        >['request']['abi'],
        'shoot',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'shoot' }
    : UseContractWriteConfig<typeof iTankGameABI, 'shoot', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'shoot'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof iTankGameABI, 'shoot', TMode>({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    functionName: 'shoot',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iTankGameABI}__ and `functionName` set to `"upgrade"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameUpgrade<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof iTankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iTankGameABI,
          'upgrade'
        >['request']['abi'],
        'upgrade',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'upgrade' }
    : UseContractWriteConfig<typeof iTankGameABI, 'upgrade', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'upgrade'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof iTankGameABI, 'upgrade', TMode>({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    functionName: 'upgrade',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iTankGameABI}__ and `functionName` set to `"vote"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameVote<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof iTankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iTankGameABI,
          'vote'
        >['request']['abi'],
        'vote',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'vote' }
    : UseContractWriteConfig<typeof iTankGameABI, 'vote', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'vote'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof iTankGameABI, 'vote', TMode>({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    functionName: 'vote',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iTankGameABI}__.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareITankGameWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iTankGameABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    ...config,
  } as UsePrepareContractWriteConfig<typeof iTankGameABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iTankGameABI}__ and `functionName` set to `"addHooks"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareITankGameAddHooks(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iTankGameABI, 'addHooks'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    functionName: 'addHooks',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iTankGameABI, 'addHooks'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iTankGameABI}__ and `functionName` set to `"claim"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareITankGameClaim(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iTankGameABI, 'claim'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    functionName: 'claim',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iTankGameABI, 'claim'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iTankGameABI}__ and `functionName` set to `"delegate"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareITankGameDelegate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iTankGameABI, 'delegate'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    functionName: 'delegate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iTankGameABI, 'delegate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iTankGameABI}__ and `functionName` set to `"drip"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareITankGameDrip(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iTankGameABI, 'drip'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    functionName: 'drip',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iTankGameABI, 'drip'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iTankGameABI}__ and `functionName` set to `"give"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareITankGameGive(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iTankGameABI, 'give'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    functionName: 'give',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iTankGameABI, 'give'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iTankGameABI}__ and `functionName` set to `"initialize"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareITankGameInitialize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iTankGameABI, 'initialize'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iTankGameABI, 'initialize'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iTankGameABI}__ and `functionName` set to `"join"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareITankGameJoin(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iTankGameABI, 'join'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    functionName: 'join',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iTankGameABI, 'join'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iTankGameABI}__ and `functionName` set to `"move"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareITankGameMove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iTankGameABI, 'move'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    functionName: 'move',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iTankGameABI, 'move'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iTankGameABI}__ and `functionName` set to `"reveal"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareITankGameReveal(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iTankGameABI, 'reveal'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    functionName: 'reveal',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iTankGameABI, 'reveal'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iTankGameABI}__ and `functionName` set to `"shoot"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareITankGameShoot(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iTankGameABI, 'shoot'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    functionName: 'shoot',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iTankGameABI, 'shoot'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iTankGameABI}__ and `functionName` set to `"upgrade"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareITankGameUpgrade(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iTankGameABI, 'upgrade'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    functionName: 'upgrade',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iTankGameABI, 'upgrade'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iTankGameABI}__ and `functionName` set to `"vote"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareITankGameVote(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iTankGameABI, 'vote'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    functionName: 'vote',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iTankGameABI, 'vote'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iTankGameABI}__.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof iTankGameABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    ...config,
  } as UseContractEventConfig<typeof iTankGameABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iTankGameABI}__ and `eventName` set to `"BountyCompleted"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameBountyCompletedEvent(
  config: Omit<
    UseContractEventConfig<typeof iTankGameABI, 'BountyCompleted'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    eventName: 'BountyCompleted',
    ...config,
  } as UseContractEventConfig<typeof iTankGameABI, 'BountyCompleted'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iTankGameABI}__ and `eventName` set to `"Claim"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameClaimEvent(
  config: Omit<
    UseContractEventConfig<typeof iTankGameABI, 'Claim'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    eventName: 'Claim',
    ...config,
  } as UseContractEventConfig<typeof iTankGameABI, 'Claim'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iTankGameABI}__ and `eventName` set to `"Commit"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameCommitEvent(
  config: Omit<
    UseContractEventConfig<typeof iTankGameABI, 'Commit'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    eventName: 'Commit',
    ...config,
  } as UseContractEventConfig<typeof iTankGameABI, 'Commit'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iTankGameABI}__ and `eventName` set to `"Curse"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameCurseEvent(
  config: Omit<
    UseContractEventConfig<typeof iTankGameABI, 'Curse'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    eventName: 'Curse',
    ...config,
  } as UseContractEventConfig<typeof iTankGameABI, 'Curse'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iTankGameABI}__ and `eventName` set to `"Death"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameDeathEvent(
  config: Omit<
    UseContractEventConfig<typeof iTankGameABI, 'Death'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    eventName: 'Death',
    ...config,
  } as UseContractEventConfig<typeof iTankGameABI, 'Death'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iTankGameABI}__ and `eventName` set to `"Delegate"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameDelegateEvent(
  config: Omit<
    UseContractEventConfig<typeof iTankGameABI, 'Delegate'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    eventName: 'Delegate',
    ...config,
  } as UseContractEventConfig<typeof iTankGameABI, 'Delegate'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iTankGameABI}__ and `eventName` set to `"Drip"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameDripEvent(
  config: Omit<
    UseContractEventConfig<typeof iTankGameABI, 'Drip'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    eventName: 'Drip',
    ...config,
  } as UseContractEventConfig<typeof iTankGameABI, 'Drip'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iTankGameABI}__ and `eventName` set to `"GameInit"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameGameInitEvent(
  config: Omit<
    UseContractEventConfig<typeof iTankGameABI, 'GameInit'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    eventName: 'GameInit',
    ...config,
  } as UseContractEventConfig<typeof iTankGameABI, 'GameInit'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iTankGameABI}__ and `eventName` set to `"GameOver"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameGameOverEvent(
  config: Omit<
    UseContractEventConfig<typeof iTankGameABI, 'GameOver'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    eventName: 'GameOver',
    ...config,
  } as UseContractEventConfig<typeof iTankGameABI, 'GameOver'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iTankGameABI}__ and `eventName` set to `"GameStarted"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameGameStartedEvent(
  config: Omit<
    UseContractEventConfig<typeof iTankGameABI, 'GameStarted'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    eventName: 'GameStarted',
    ...config,
  } as UseContractEventConfig<typeof iTankGameABI, 'GameStarted'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iTankGameABI}__ and `eventName` set to `"Give"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameGiveEvent(
  config: Omit<
    UseContractEventConfig<typeof iTankGameABI, 'Give'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    eventName: 'Give',
    ...config,
  } as UseContractEventConfig<typeof iTankGameABI, 'Give'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iTankGameABI}__ and `eventName` set to `"HooksAdded"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameHooksAddedEvent(
  config: Omit<
    UseContractEventConfig<typeof iTankGameABI, 'HooksAdded'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    eventName: 'HooksAdded',
    ...config,
  } as UseContractEventConfig<typeof iTankGameABI, 'HooksAdded'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iTankGameABI}__ and `eventName` set to `"Move"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameMoveEvent(
  config: Omit<
    UseContractEventConfig<typeof iTankGameABI, 'Move'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    eventName: 'Move',
    ...config,
  } as UseContractEventConfig<typeof iTankGameABI, 'Move'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iTankGameABI}__ and `eventName` set to `"PlayerJoined"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGamePlayerJoinedEvent(
  config: Omit<
    UseContractEventConfig<typeof iTankGameABI, 'PlayerJoined'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    eventName: 'PlayerJoined',
    ...config,
  } as UseContractEventConfig<typeof iTankGameABI, 'PlayerJoined'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iTankGameABI}__ and `eventName` set to `"PrizeIncrease"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGamePrizeIncreaseEvent(
  config: Omit<
    UseContractEventConfig<typeof iTankGameABI, 'PrizeIncrease'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    eventName: 'PrizeIncrease',
    ...config,
  } as UseContractEventConfig<typeof iTankGameABI, 'PrizeIncrease'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iTankGameABI}__ and `eventName` set to `"Reveal"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameRevealEvent(
  config: Omit<
    UseContractEventConfig<typeof iTankGameABI, 'Reveal'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    eventName: 'Reveal',
    ...config,
  } as UseContractEventConfig<typeof iTankGameABI, 'Reveal'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iTankGameABI}__ and `eventName` set to `"Revive"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameReviveEvent(
  config: Omit<
    UseContractEventConfig<typeof iTankGameABI, 'Revive'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    eventName: 'Revive',
    ...config,
  } as UseContractEventConfig<typeof iTankGameABI, 'Revive'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iTankGameABI}__ and `eventName` set to `"Shoot"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameShootEvent(
  config: Omit<
    UseContractEventConfig<typeof iTankGameABI, 'Shoot'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    eventName: 'Shoot',
    ...config,
  } as UseContractEventConfig<typeof iTankGameABI, 'Shoot'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iTankGameABI}__ and `eventName` set to `"SpawnHeart"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameSpawnHeartEvent(
  config: Omit<
    UseContractEventConfig<typeof iTankGameABI, 'SpawnHeart'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    eventName: 'SpawnHeart',
    ...config,
  } as UseContractEventConfig<typeof iTankGameABI, 'SpawnHeart'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iTankGameABI}__ and `eventName` set to `"Upgrade"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameUpgradeEvent(
  config: Omit<
    UseContractEventConfig<typeof iTankGameABI, 'Upgrade'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    eventName: 'Upgrade',
    ...config,
  } as UseContractEventConfig<typeof iTankGameABI, 'Upgrade'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iTankGameABI}__ and `eventName` set to `"Vote"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useITankGameVoteEvent(
  config: Omit<
    UseContractEventConfig<typeof iTankGameABI, 'Vote'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof iTankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: iTankGameABI,
    address: iTankGameAddress[chainId as keyof typeof iTankGameAddress],
    eventName: 'Vote',
    ...config,
  } as UseContractEventConfig<typeof iTankGameABI, 'Vote'>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iTreatyABI}__.
 */
export function useITreatyWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof iTreatyABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof iTreatyABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof iTreatyABI, TFunctionName, TMode>({
    abi: iTreatyABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iTreatyABI}__ and `functionName` set to `"accept"`.
 */
export function useITreatyAccept<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iTreatyABI,
          'accept'
        >['request']['abi'],
        'accept',
        TMode
      > & { functionName?: 'accept' }
    : UseContractWriteConfig<typeof iTreatyABI, 'accept', TMode> & {
        abi?: never
        functionName?: 'accept'
      } = {} as any,
) {
  return useContractWrite<typeof iTreatyABI, 'accept', TMode>({
    abi: iTreatyABI,
    functionName: 'accept',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iTreatyABI}__ and `functionName` set to `"propose"`.
 */
export function useITreatyPropose<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iTreatyABI,
          'propose'
        >['request']['abi'],
        'propose',
        TMode
      > & { functionName?: 'propose' }
    : UseContractWriteConfig<typeof iTreatyABI, 'propose', TMode> & {
        abi?: never
        functionName?: 'propose'
      } = {} as any,
) {
  return useContractWrite<typeof iTreatyABI, 'propose', TMode>({
    abi: iTreatyABI,
    functionName: 'propose',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iTreatyABI}__.
 */
export function usePrepareITreatyWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iTreatyABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iTreatyABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof iTreatyABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iTreatyABI}__ and `functionName` set to `"accept"`.
 */
export function usePrepareITreatyAccept(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iTreatyABI, 'accept'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iTreatyABI,
    functionName: 'accept',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iTreatyABI, 'accept'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iTreatyABI}__ and `functionName` set to `"propose"`.
 */
export function usePrepareITreatyPropose(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iTreatyABI, 'propose'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iTreatyABI,
    functionName: 'propose',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iTreatyABI, 'propose'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iTreatyABI}__.
 */
export function useITreatyEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof iTreatyABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({
    abi: iTreatyABI,
    ...config,
  } as UseContractEventConfig<typeof iTreatyABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iTreatyABI}__ and `eventName` set to `"AcceptedTreaty"`.
 */
export function useITreatyAcceptedTreatyEvent(
  config: Omit<
    UseContractEventConfig<typeof iTreatyABI, 'AcceptedTreaty'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: iTreatyABI,
    eventName: 'AcceptedTreaty',
    ...config,
  } as UseContractEventConfig<typeof iTreatyABI, 'AcceptedTreaty'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iTreatyABI}__ and `eventName` set to `"ProposedTreaty"`.
 */
export function useITreatyProposedTreatyEvent(
  config: Omit<
    UseContractEventConfig<typeof iTreatyABI, 'ProposedTreaty'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: iTreatyABI,
    eventName: 'ProposedTreaty',
    ...config,
  } as UseContractEventConfig<typeof iTreatyABI, 'ProposedTreaty'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionABI}__.
 */
export function useNonAggressionRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof nonAggressionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nonAggressionABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionABI,
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"afterClaim"`.
 */
export function useNonAggressionAfterClaim<
  TFunctionName extends 'afterClaim',
  TSelectData = ReadContractResult<typeof nonAggressionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nonAggressionABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionABI,
    functionName: 'afterClaim',
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"afterDelegate"`.
 */
export function useNonAggressionAfterDelegate<
  TFunctionName extends 'afterDelegate',
  TSelectData = ReadContractResult<typeof nonAggressionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nonAggressionABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionABI,
    functionName: 'afterDelegate',
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"afterDrip"`.
 */
export function useNonAggressionAfterDrip<
  TFunctionName extends 'afterDrip',
  TSelectData = ReadContractResult<typeof nonAggressionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nonAggressionABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionABI,
    functionName: 'afterDrip',
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"afterJoin"`.
 */
export function useNonAggressionAfterJoin<
  TFunctionName extends 'afterJoin',
  TSelectData = ReadContractResult<typeof nonAggressionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nonAggressionABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionABI,
    functionName: 'afterJoin',
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"allies"`.
 */
export function useNonAggressionAllies<
  TFunctionName extends 'allies',
  TSelectData = ReadContractResult<typeof nonAggressionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nonAggressionABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionABI,
    functionName: 'allies',
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"beforeClaim"`.
 */
export function useNonAggressionBeforeClaim<
  TFunctionName extends 'beforeClaim',
  TSelectData = ReadContractResult<typeof nonAggressionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nonAggressionABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionABI,
    functionName: 'beforeClaim',
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"beforeDelegate"`.
 */
export function useNonAggressionBeforeDelegate<
  TFunctionName extends 'beforeDelegate',
  TSelectData = ReadContractResult<typeof nonAggressionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nonAggressionABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionABI,
    functionName: 'beforeDelegate',
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"beforeDrip"`.
 */
export function useNonAggressionBeforeDrip<
  TFunctionName extends 'beforeDrip',
  TSelectData = ReadContractResult<typeof nonAggressionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nonAggressionABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionABI,
    functionName: 'beforeDrip',
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"beforeGive"`.
 */
export function useNonAggressionBeforeGive<
  TFunctionName extends 'beforeGive',
  TSelectData = ReadContractResult<typeof nonAggressionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nonAggressionABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionABI,
    functionName: 'beforeGive',
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"beforeJoin"`.
 */
export function useNonAggressionBeforeJoin<
  TFunctionName extends 'beforeJoin',
  TSelectData = ReadContractResult<typeof nonAggressionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nonAggressionABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionABI,
    functionName: 'beforeJoin',
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"beforeReveal"`.
 */
export function useNonAggressionBeforeReveal<
  TFunctionName extends 'beforeReveal',
  TSelectData = ReadContractResult<typeof nonAggressionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nonAggressionABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionABI,
    functionName: 'beforeReveal',
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"beforeShoot"`.
 */
export function useNonAggressionBeforeShoot<
  TFunctionName extends 'beforeShoot',
  TSelectData = ReadContractResult<typeof nonAggressionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nonAggressionABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionABI,
    functionName: 'beforeShoot',
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"ownerTank"`.
 */
export function useNonAggressionOwnerTank<
  TFunctionName extends 'ownerTank',
  TSelectData = ReadContractResult<typeof nonAggressionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nonAggressionABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionABI,
    functionName: 'ownerTank',
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"proposals"`.
 */
export function useNonAggressionProposals<
  TFunctionName extends 'proposals',
  TSelectData = ReadContractResult<typeof nonAggressionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nonAggressionABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionABI,
    functionName: 'proposals',
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"tankGame"`.
 */
export function useNonAggressionTankGame<
  TFunctionName extends 'tankGame',
  TSelectData = ReadContractResult<typeof nonAggressionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nonAggressionABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionABI,
    functionName: 'tankGame',
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"tankGameView"`.
 */
export function useNonAggressionTankGameView<
  TFunctionName extends 'tankGameView',
  TSelectData = ReadContractResult<typeof nonAggressionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nonAggressionABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionABI,
    functionName: 'tankGameView',
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nonAggressionABI}__.
 */
export function useNonAggressionWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nonAggressionABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof nonAggressionABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof nonAggressionABI, TFunctionName, TMode>({
    abi: nonAggressionABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"accept"`.
 */
export function useNonAggressionAccept<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nonAggressionABI,
          'accept'
        >['request']['abi'],
        'accept',
        TMode
      > & { functionName?: 'accept' }
    : UseContractWriteConfig<typeof nonAggressionABI, 'accept', TMode> & {
        abi?: never
        functionName?: 'accept'
      } = {} as any,
) {
  return useContractWrite<typeof nonAggressionABI, 'accept', TMode>({
    abi: nonAggressionABI,
    functionName: 'accept',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"afterGive"`.
 */
export function useNonAggressionAfterGive<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nonAggressionABI,
          'afterGive'
        >['request']['abi'],
        'afterGive',
        TMode
      > & { functionName?: 'afterGive' }
    : UseContractWriteConfig<typeof nonAggressionABI, 'afterGive', TMode> & {
        abi?: never
        functionName?: 'afterGive'
      } = {} as any,
) {
  return useContractWrite<typeof nonAggressionABI, 'afterGive', TMode>({
    abi: nonAggressionABI,
    functionName: 'afterGive',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"afterMove"`.
 */
export function useNonAggressionAfterMove<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nonAggressionABI,
          'afterMove'
        >['request']['abi'],
        'afterMove',
        TMode
      > & { functionName?: 'afterMove' }
    : UseContractWriteConfig<typeof nonAggressionABI, 'afterMove', TMode> & {
        abi?: never
        functionName?: 'afterMove'
      } = {} as any,
) {
  return useContractWrite<typeof nonAggressionABI, 'afterMove', TMode>({
    abi: nonAggressionABI,
    functionName: 'afterMove',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"afterReveal"`.
 */
export function useNonAggressionAfterReveal<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nonAggressionABI,
          'afterReveal'
        >['request']['abi'],
        'afterReveal',
        TMode
      > & { functionName?: 'afterReveal' }
    : UseContractWriteConfig<typeof nonAggressionABI, 'afterReveal', TMode> & {
        abi?: never
        functionName?: 'afterReveal'
      } = {} as any,
) {
  return useContractWrite<typeof nonAggressionABI, 'afterReveal', TMode>({
    abi: nonAggressionABI,
    functionName: 'afterReveal',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"afterShoot"`.
 */
export function useNonAggressionAfterShoot<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nonAggressionABI,
          'afterShoot'
        >['request']['abi'],
        'afterShoot',
        TMode
      > & { functionName?: 'afterShoot' }
    : UseContractWriteConfig<typeof nonAggressionABI, 'afterShoot', TMode> & {
        abi?: never
        functionName?: 'afterShoot'
      } = {} as any,
) {
  return useContractWrite<typeof nonAggressionABI, 'afterShoot', TMode>({
    abi: nonAggressionABI,
    functionName: 'afterShoot',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"afterUpgrade"`.
 */
export function useNonAggressionAfterUpgrade<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nonAggressionABI,
          'afterUpgrade'
        >['request']['abi'],
        'afterUpgrade',
        TMode
      > & { functionName?: 'afterUpgrade' }
    : UseContractWriteConfig<typeof nonAggressionABI, 'afterUpgrade', TMode> & {
        abi?: never
        functionName?: 'afterUpgrade'
      } = {} as any,
) {
  return useContractWrite<typeof nonAggressionABI, 'afterUpgrade', TMode>({
    abi: nonAggressionABI,
    functionName: 'afterUpgrade',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"afterVote"`.
 */
export function useNonAggressionAfterVote<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nonAggressionABI,
          'afterVote'
        >['request']['abi'],
        'afterVote',
        TMode
      > & { functionName?: 'afterVote' }
    : UseContractWriteConfig<typeof nonAggressionABI, 'afterVote', TMode> & {
        abi?: never
        functionName?: 'afterVote'
      } = {} as any,
) {
  return useContractWrite<typeof nonAggressionABI, 'afterVote', TMode>({
    abi: nonAggressionABI,
    functionName: 'afterVote',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"beforeMove"`.
 */
export function useNonAggressionBeforeMove<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nonAggressionABI,
          'beforeMove'
        >['request']['abi'],
        'beforeMove',
        TMode
      > & { functionName?: 'beforeMove' }
    : UseContractWriteConfig<typeof nonAggressionABI, 'beforeMove', TMode> & {
        abi?: never
        functionName?: 'beforeMove'
      } = {} as any,
) {
  return useContractWrite<typeof nonAggressionABI, 'beforeMove', TMode>({
    abi: nonAggressionABI,
    functionName: 'beforeMove',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"beforeUpgrade"`.
 */
export function useNonAggressionBeforeUpgrade<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nonAggressionABI,
          'beforeUpgrade'
        >['request']['abi'],
        'beforeUpgrade',
        TMode
      > & { functionName?: 'beforeUpgrade' }
    : UseContractWriteConfig<
        typeof nonAggressionABI,
        'beforeUpgrade',
        TMode
      > & {
        abi?: never
        functionName?: 'beforeUpgrade'
      } = {} as any,
) {
  return useContractWrite<typeof nonAggressionABI, 'beforeUpgrade', TMode>({
    abi: nonAggressionABI,
    functionName: 'beforeUpgrade',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"beforeVote"`.
 */
export function useNonAggressionBeforeVote<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nonAggressionABI,
          'beforeVote'
        >['request']['abi'],
        'beforeVote',
        TMode
      > & { functionName?: 'beforeVote' }
    : UseContractWriteConfig<typeof nonAggressionABI, 'beforeVote', TMode> & {
        abi?: never
        functionName?: 'beforeVote'
      } = {} as any,
) {
  return useContractWrite<typeof nonAggressionABI, 'beforeVote', TMode>({
    abi: nonAggressionABI,
    functionName: 'beforeVote',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"propose"`.
 */
export function useNonAggressionPropose<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nonAggressionABI,
          'propose'
        >['request']['abi'],
        'propose',
        TMode
      > & { functionName?: 'propose' }
    : UseContractWriteConfig<typeof nonAggressionABI, 'propose', TMode> & {
        abi?: never
        functionName?: 'propose'
      } = {} as any,
) {
  return useContractWrite<typeof nonAggressionABI, 'propose', TMode>({
    abi: nonAggressionABI,
    functionName: 'propose',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nonAggressionABI}__.
 */
export function usePrepareNonAggressionWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nonAggressionABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: nonAggressionABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof nonAggressionABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"accept"`.
 */
export function usePrepareNonAggressionAccept(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nonAggressionABI, 'accept'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: nonAggressionABI,
    functionName: 'accept',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nonAggressionABI, 'accept'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"afterGive"`.
 */
export function usePrepareNonAggressionAfterGive(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nonAggressionABI, 'afterGive'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: nonAggressionABI,
    functionName: 'afterGive',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nonAggressionABI, 'afterGive'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"afterMove"`.
 */
export function usePrepareNonAggressionAfterMove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nonAggressionABI, 'afterMove'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: nonAggressionABI,
    functionName: 'afterMove',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nonAggressionABI, 'afterMove'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"afterReveal"`.
 */
export function usePrepareNonAggressionAfterReveal(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nonAggressionABI, 'afterReveal'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: nonAggressionABI,
    functionName: 'afterReveal',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nonAggressionABI, 'afterReveal'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"afterShoot"`.
 */
export function usePrepareNonAggressionAfterShoot(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nonAggressionABI, 'afterShoot'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: nonAggressionABI,
    functionName: 'afterShoot',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nonAggressionABI, 'afterShoot'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"afterUpgrade"`.
 */
export function usePrepareNonAggressionAfterUpgrade(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nonAggressionABI, 'afterUpgrade'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: nonAggressionABI,
    functionName: 'afterUpgrade',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nonAggressionABI, 'afterUpgrade'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"afterVote"`.
 */
export function usePrepareNonAggressionAfterVote(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nonAggressionABI, 'afterVote'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: nonAggressionABI,
    functionName: 'afterVote',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nonAggressionABI, 'afterVote'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"beforeMove"`.
 */
export function usePrepareNonAggressionBeforeMove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nonAggressionABI, 'beforeMove'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: nonAggressionABI,
    functionName: 'beforeMove',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nonAggressionABI, 'beforeMove'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"beforeUpgrade"`.
 */
export function usePrepareNonAggressionBeforeUpgrade(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nonAggressionABI, 'beforeUpgrade'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: nonAggressionABI,
    functionName: 'beforeUpgrade',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nonAggressionABI, 'beforeUpgrade'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"beforeVote"`.
 */
export function usePrepareNonAggressionBeforeVote(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nonAggressionABI, 'beforeVote'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: nonAggressionABI,
    functionName: 'beforeVote',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nonAggressionABI, 'beforeVote'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nonAggressionABI}__ and `functionName` set to `"propose"`.
 */
export function usePrepareNonAggressionPropose(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nonAggressionABI, 'propose'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: nonAggressionABI,
    functionName: 'propose',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nonAggressionABI, 'propose'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nonAggressionABI}__.
 */
export function useNonAggressionEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof nonAggressionABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({
    abi: nonAggressionABI,
    ...config,
  } as UseContractEventConfig<typeof nonAggressionABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nonAggressionABI}__ and `eventName` set to `"AcceptedTreaty"`.
 */
export function useNonAggressionAcceptedTreatyEvent(
  config: Omit<
    UseContractEventConfig<typeof nonAggressionABI, 'AcceptedTreaty'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: nonAggressionABI,
    eventName: 'AcceptedTreaty',
    ...config,
  } as UseContractEventConfig<typeof nonAggressionABI, 'AcceptedTreaty'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nonAggressionABI}__ and `eventName` set to `"NonAggressionCreated"`.
 */
export function useNonAggressionNonAggressionCreatedEvent(
  config: Omit<
    UseContractEventConfig<typeof nonAggressionABI, 'NonAggressionCreated'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: nonAggressionABI,
    eventName: 'NonAggressionCreated',
    ...config,
  } as UseContractEventConfig<typeof nonAggressionABI, 'NonAggressionCreated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nonAggressionABI}__ and `eventName` set to `"ProposedTreaty"`.
 */
export function useNonAggressionProposedTreatyEvent(
  config: Omit<
    UseContractEventConfig<typeof nonAggressionABI, 'ProposedTreaty'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: nonAggressionABI,
    eventName: 'ProposedTreaty',
    ...config,
  } as UseContractEventConfig<typeof nonAggressionABI, 'ProposedTreaty'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionHookABI}__.
 */
export function useNonAggressionHookRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof nonAggressionHookABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nonAggressionHookABI,
      TFunctionName,
      TSelectData
    >,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionHookABI,
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionHookABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"afterClaim"`.
 */
export function useNonAggressionHookAfterClaim<
  TFunctionName extends 'afterClaim',
  TSelectData = ReadContractResult<typeof nonAggressionHookABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nonAggressionHookABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionHookABI,
    functionName: 'afterClaim',
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionHookABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"afterDelegate"`.
 */
export function useNonAggressionHookAfterDelegate<
  TFunctionName extends 'afterDelegate',
  TSelectData = ReadContractResult<typeof nonAggressionHookABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nonAggressionHookABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionHookABI,
    functionName: 'afterDelegate',
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionHookABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"afterDrip"`.
 */
export function useNonAggressionHookAfterDrip<
  TFunctionName extends 'afterDrip',
  TSelectData = ReadContractResult<typeof nonAggressionHookABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nonAggressionHookABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionHookABI,
    functionName: 'afterDrip',
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionHookABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"afterJoin"`.
 */
export function useNonAggressionHookAfterJoin<
  TFunctionName extends 'afterJoin',
  TSelectData = ReadContractResult<typeof nonAggressionHookABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nonAggressionHookABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionHookABI,
    functionName: 'afterJoin',
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionHookABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"beforeClaim"`.
 */
export function useNonAggressionHookBeforeClaim<
  TFunctionName extends 'beforeClaim',
  TSelectData = ReadContractResult<typeof nonAggressionHookABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nonAggressionHookABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionHookABI,
    functionName: 'beforeClaim',
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionHookABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"beforeDelegate"`.
 */
export function useNonAggressionHookBeforeDelegate<
  TFunctionName extends 'beforeDelegate',
  TSelectData = ReadContractResult<typeof nonAggressionHookABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nonAggressionHookABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionHookABI,
    functionName: 'beforeDelegate',
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionHookABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"beforeDrip"`.
 */
export function useNonAggressionHookBeforeDrip<
  TFunctionName extends 'beforeDrip',
  TSelectData = ReadContractResult<typeof nonAggressionHookABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nonAggressionHookABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionHookABI,
    functionName: 'beforeDrip',
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionHookABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"beforeGive"`.
 */
export function useNonAggressionHookBeforeGive<
  TFunctionName extends 'beforeGive',
  TSelectData = ReadContractResult<typeof nonAggressionHookABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nonAggressionHookABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionHookABI,
    functionName: 'beforeGive',
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionHookABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"beforeJoin"`.
 */
export function useNonAggressionHookBeforeJoin<
  TFunctionName extends 'beforeJoin',
  TSelectData = ReadContractResult<typeof nonAggressionHookABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nonAggressionHookABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionHookABI,
    functionName: 'beforeJoin',
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionHookABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"beforeReveal"`.
 */
export function useNonAggressionHookBeforeReveal<
  TFunctionName extends 'beforeReveal',
  TSelectData = ReadContractResult<typeof nonAggressionHookABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nonAggressionHookABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: nonAggressionHookABI,
    functionName: 'beforeReveal',
    ...config,
  } as UseContractReadConfig<
    typeof nonAggressionHookABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nonAggressionHookABI}__.
 */
export function useNonAggressionHookWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nonAggressionHookABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<
        typeof nonAggressionHookABI,
        TFunctionName,
        TMode
      > & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof nonAggressionHookABI, TFunctionName, TMode>({
    abi: nonAggressionHookABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"accept"`.
 */
export function useNonAggressionHookAccept<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nonAggressionHookABI,
          'accept'
        >['request']['abi'],
        'accept',
        TMode
      > & { functionName?: 'accept' }
    : UseContractWriteConfig<typeof nonAggressionHookABI, 'accept', TMode> & {
        abi?: never
        functionName?: 'accept'
      } = {} as any,
) {
  return useContractWrite<typeof nonAggressionHookABI, 'accept', TMode>({
    abi: nonAggressionHookABI,
    functionName: 'accept',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"afterGive"`.
 */
export function useNonAggressionHookAfterGive<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nonAggressionHookABI,
          'afterGive'
        >['request']['abi'],
        'afterGive',
        TMode
      > & { functionName?: 'afterGive' }
    : UseContractWriteConfig<
        typeof nonAggressionHookABI,
        'afterGive',
        TMode
      > & {
        abi?: never
        functionName?: 'afterGive'
      } = {} as any,
) {
  return useContractWrite<typeof nonAggressionHookABI, 'afterGive', TMode>({
    abi: nonAggressionHookABI,
    functionName: 'afterGive',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"afterMove"`.
 */
export function useNonAggressionHookAfterMove<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nonAggressionHookABI,
          'afterMove'
        >['request']['abi'],
        'afterMove',
        TMode
      > & { functionName?: 'afterMove' }
    : UseContractWriteConfig<
        typeof nonAggressionHookABI,
        'afterMove',
        TMode
      > & {
        abi?: never
        functionName?: 'afterMove'
      } = {} as any,
) {
  return useContractWrite<typeof nonAggressionHookABI, 'afterMove', TMode>({
    abi: nonAggressionHookABI,
    functionName: 'afterMove',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"afterReveal"`.
 */
export function useNonAggressionHookAfterReveal<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nonAggressionHookABI,
          'afterReveal'
        >['request']['abi'],
        'afterReveal',
        TMode
      > & { functionName?: 'afterReveal' }
    : UseContractWriteConfig<
        typeof nonAggressionHookABI,
        'afterReveal',
        TMode
      > & {
        abi?: never
        functionName?: 'afterReveal'
      } = {} as any,
) {
  return useContractWrite<typeof nonAggressionHookABI, 'afterReveal', TMode>({
    abi: nonAggressionHookABI,
    functionName: 'afterReveal',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"afterShoot"`.
 */
export function useNonAggressionHookAfterShoot<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nonAggressionHookABI,
          'afterShoot'
        >['request']['abi'],
        'afterShoot',
        TMode
      > & { functionName?: 'afterShoot' }
    : UseContractWriteConfig<
        typeof nonAggressionHookABI,
        'afterShoot',
        TMode
      > & {
        abi?: never
        functionName?: 'afterShoot'
      } = {} as any,
) {
  return useContractWrite<typeof nonAggressionHookABI, 'afterShoot', TMode>({
    abi: nonAggressionHookABI,
    functionName: 'afterShoot',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"afterUpgrade"`.
 */
export function useNonAggressionHookAfterUpgrade<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nonAggressionHookABI,
          'afterUpgrade'
        >['request']['abi'],
        'afterUpgrade',
        TMode
      > & { functionName?: 'afterUpgrade' }
    : UseContractWriteConfig<
        typeof nonAggressionHookABI,
        'afterUpgrade',
        TMode
      > & {
        abi?: never
        functionName?: 'afterUpgrade'
      } = {} as any,
) {
  return useContractWrite<typeof nonAggressionHookABI, 'afterUpgrade', TMode>({
    abi: nonAggressionHookABI,
    functionName: 'afterUpgrade',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"afterVote"`.
 */
export function useNonAggressionHookAfterVote<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nonAggressionHookABI,
          'afterVote'
        >['request']['abi'],
        'afterVote',
        TMode
      > & { functionName?: 'afterVote' }
    : UseContractWriteConfig<
        typeof nonAggressionHookABI,
        'afterVote',
        TMode
      > & {
        abi?: never
        functionName?: 'afterVote'
      } = {} as any,
) {
  return useContractWrite<typeof nonAggressionHookABI, 'afterVote', TMode>({
    abi: nonAggressionHookABI,
    functionName: 'afterVote',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"beforeMove"`.
 */
export function useNonAggressionHookBeforeMove<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nonAggressionHookABI,
          'beforeMove'
        >['request']['abi'],
        'beforeMove',
        TMode
      > & { functionName?: 'beforeMove' }
    : UseContractWriteConfig<
        typeof nonAggressionHookABI,
        'beforeMove',
        TMode
      > & {
        abi?: never
        functionName?: 'beforeMove'
      } = {} as any,
) {
  return useContractWrite<typeof nonAggressionHookABI, 'beforeMove', TMode>({
    abi: nonAggressionHookABI,
    functionName: 'beforeMove',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"beforeShoot"`.
 */
export function useNonAggressionHookBeforeShoot<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nonAggressionHookABI,
          'beforeShoot'
        >['request']['abi'],
        'beforeShoot',
        TMode
      > & { functionName?: 'beforeShoot' }
    : UseContractWriteConfig<
        typeof nonAggressionHookABI,
        'beforeShoot',
        TMode
      > & {
        abi?: never
        functionName?: 'beforeShoot'
      } = {} as any,
) {
  return useContractWrite<typeof nonAggressionHookABI, 'beforeShoot', TMode>({
    abi: nonAggressionHookABI,
    functionName: 'beforeShoot',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"beforeUpgrade"`.
 */
export function useNonAggressionHookBeforeUpgrade<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nonAggressionHookABI,
          'beforeUpgrade'
        >['request']['abi'],
        'beforeUpgrade',
        TMode
      > & { functionName?: 'beforeUpgrade' }
    : UseContractWriteConfig<
        typeof nonAggressionHookABI,
        'beforeUpgrade',
        TMode
      > & {
        abi?: never
        functionName?: 'beforeUpgrade'
      } = {} as any,
) {
  return useContractWrite<typeof nonAggressionHookABI, 'beforeUpgrade', TMode>({
    abi: nonAggressionHookABI,
    functionName: 'beforeUpgrade',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"beforeVote"`.
 */
export function useNonAggressionHookBeforeVote<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nonAggressionHookABI,
          'beforeVote'
        >['request']['abi'],
        'beforeVote',
        TMode
      > & { functionName?: 'beforeVote' }
    : UseContractWriteConfig<
        typeof nonAggressionHookABI,
        'beforeVote',
        TMode
      > & {
        abi?: never
        functionName?: 'beforeVote'
      } = {} as any,
) {
  return useContractWrite<typeof nonAggressionHookABI, 'beforeVote', TMode>({
    abi: nonAggressionHookABI,
    functionName: 'beforeVote',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nonAggressionHookABI}__.
 */
export function usePrepareNonAggressionHookWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nonAggressionHookABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: nonAggressionHookABI,
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nonAggressionHookABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"accept"`.
 */
export function usePrepareNonAggressionHookAccept(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nonAggressionHookABI, 'accept'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: nonAggressionHookABI,
    functionName: 'accept',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nonAggressionHookABI, 'accept'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"afterGive"`.
 */
export function usePrepareNonAggressionHookAfterGive(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nonAggressionHookABI, 'afterGive'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: nonAggressionHookABI,
    functionName: 'afterGive',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nonAggressionHookABI, 'afterGive'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"afterMove"`.
 */
export function usePrepareNonAggressionHookAfterMove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nonAggressionHookABI, 'afterMove'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: nonAggressionHookABI,
    functionName: 'afterMove',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nonAggressionHookABI, 'afterMove'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"afterReveal"`.
 */
export function usePrepareNonAggressionHookAfterReveal(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nonAggressionHookABI, 'afterReveal'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: nonAggressionHookABI,
    functionName: 'afterReveal',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nonAggressionHookABI,
    'afterReveal'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"afterShoot"`.
 */
export function usePrepareNonAggressionHookAfterShoot(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nonAggressionHookABI, 'afterShoot'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: nonAggressionHookABI,
    functionName: 'afterShoot',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nonAggressionHookABI, 'afterShoot'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"afterUpgrade"`.
 */
export function usePrepareNonAggressionHookAfterUpgrade(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nonAggressionHookABI, 'afterUpgrade'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: nonAggressionHookABI,
    functionName: 'afterUpgrade',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nonAggressionHookABI,
    'afterUpgrade'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"afterVote"`.
 */
export function usePrepareNonAggressionHookAfterVote(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nonAggressionHookABI, 'afterVote'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: nonAggressionHookABI,
    functionName: 'afterVote',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nonAggressionHookABI, 'afterVote'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"beforeMove"`.
 */
export function usePrepareNonAggressionHookBeforeMove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nonAggressionHookABI, 'beforeMove'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: nonAggressionHookABI,
    functionName: 'beforeMove',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nonAggressionHookABI, 'beforeMove'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"beforeShoot"`.
 */
export function usePrepareNonAggressionHookBeforeShoot(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nonAggressionHookABI, 'beforeShoot'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: nonAggressionHookABI,
    functionName: 'beforeShoot',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nonAggressionHookABI,
    'beforeShoot'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"beforeUpgrade"`.
 */
export function usePrepareNonAggressionHookBeforeUpgrade(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nonAggressionHookABI, 'beforeUpgrade'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: nonAggressionHookABI,
    functionName: 'beforeUpgrade',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nonAggressionHookABI,
    'beforeUpgrade'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nonAggressionHookABI}__ and `functionName` set to `"beforeVote"`.
 */
export function usePrepareNonAggressionHookBeforeVote(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nonAggressionHookABI, 'beforeVote'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: nonAggressionHookABI,
    functionName: 'beforeVote',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nonAggressionHookABI, 'beforeVote'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"_getEpoch"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameGetEpoch<
  TFunctionName extends '_getEpoch',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: '_getEpoch',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"aliveTanksIdSum"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameAliveTanksIdSum<
  TFunctionName extends 'aliveTanksIdSum',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'aliveTanksIdSum',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"board"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameBoard<
  TFunctionName extends 'board',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'board',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"claimed"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameClaimed<
  TFunctionName extends 'claimed',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'claimed',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"deadTanks"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameDeadTanks<
  TFunctionName extends 'deadTanks',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'deadTanks',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"delegates"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameDelegates<
  TFunctionName extends 'delegates',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'delegates',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"epochStart"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameEpochStart<
  TFunctionName extends 'epochStart',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'epochStart',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"getLastDrip"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameGetLastDrip<
  TFunctionName extends 'getLastDrip',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'getLastDrip',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"getUpgradeCost"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameGetUpgradeCost<
  TFunctionName extends 'getUpgradeCost',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'getUpgradeCost',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"heartsOnBoard"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameHeartsOnBoard<
  TFunctionName extends 'heartsOnBoard',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'heartsOnBoard',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"isAuth"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameIsAuth<
  TFunctionName extends 'isAuth',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'isAuth',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"lastDripEpoch"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameLastDripEpoch<
  TFunctionName extends 'lastDripEpoch',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'lastDripEpoch',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"lastRevealBlock"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameLastRevealBlock<
  TFunctionName extends 'lastRevealBlock',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'lastRevealBlock',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"numTanksAlive"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameNumTanksAlive<
  TFunctionName extends 'numTanksAlive',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'numTanksAlive',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"owner"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"players"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGamePlayers<
  TFunctionName extends 'players',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'players',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"playersCount"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGamePlayersCount<
  TFunctionName extends 'playersCount',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'playersCount',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"podium"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGamePodium<
  TFunctionName extends 'podium',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'podium',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"prizePool"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGamePrizePool<
  TFunctionName extends 'prizePool',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'prizePool',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"revealBlock"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameRevealBlock<
  TFunctionName extends 'revealBlock',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'revealBlock',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"settings"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameSettings<
  TFunctionName extends 'settings',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'settings',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"state"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameState<
  TFunctionName extends 'state',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'state',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"stateData"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameStateData<
  TFunctionName extends 'stateData',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'stateData',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"tankHooks"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameTankHooks<
  TFunctionName extends 'tankHooks',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'tankHooks',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"tankToPosition"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameTankToPosition<
  TFunctionName extends 'tankToPosition',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'tankToPosition',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"tanks"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameTanks<
  TFunctionName extends 'tanks',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'tanks',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"tanksOnBoard"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameTanksOnBoard<
  TFunctionName extends 'tanksOnBoard',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'tanksOnBoard',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"votedThisEpoch"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameVotedThisEpoch<
  TFunctionName extends 'votedThisEpoch',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'votedThisEpoch',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"votesPerEpoch"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameVotesPerEpoch<
  TFunctionName extends 'votesPerEpoch',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'votesPerEpoch',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"votingClosed"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameVotingClosed<
  TFunctionName extends 'votingClosed',
  TSelectData = ReadContractResult<typeof tankGameABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'votingClosed',
    ...config,
  } as UseContractReadConfig<typeof tankGameABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameABI}__.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof tankGameABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof tankGameABI, TFunctionName, TMode>({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"addHooks"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameAddHooks<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameABI,
          'addHooks'
        >['request']['abi'],
        'addHooks',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'addHooks' }
    : UseContractWriteConfig<typeof tankGameABI, 'addHooks', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'addHooks'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof tankGameABI, 'addHooks', TMode>({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'addHooks',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"claim"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameClaim<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameABI,
          'claim'
        >['request']['abi'],
        'claim',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'claim' }
    : UseContractWriteConfig<typeof tankGameABI, 'claim', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'claim'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof tankGameABI, 'claim', TMode>({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'claim',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"delegate"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameDelegate<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameABI,
          'delegate'
        >['request']['abi'],
        'delegate',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'delegate' }
    : UseContractWriteConfig<typeof tankGameABI, 'delegate', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'delegate'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof tankGameABI, 'delegate', TMode>({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'delegate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"donate"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameDonate<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameABI,
          'donate'
        >['request']['abi'],
        'donate',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'donate' }
    : UseContractWriteConfig<typeof tankGameABI, 'donate', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'donate'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof tankGameABI, 'donate', TMode>({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'donate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"drip"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameDrip<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameABI,
          'drip'
        >['request']['abi'],
        'drip',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'drip' }
    : UseContractWriteConfig<typeof tankGameABI, 'drip', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'drip'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof tankGameABI, 'drip', TMode>({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'drip',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"forceAddDefaultHook"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameForceAddDefaultHook<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameABI,
          'forceAddDefaultHook'
        >['request']['abi'],
        'forceAddDefaultHook',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'forceAddDefaultHook'
      }
    : UseContractWriteConfig<
        typeof tankGameABI,
        'forceAddDefaultHook',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'forceAddDefaultHook'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof tankGameABI, 'forceAddDefaultHook', TMode>({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'forceAddDefaultHook',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"give"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameGive<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameABI,
          'give'
        >['request']['abi'],
        'give',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'give' }
    : UseContractWriteConfig<typeof tankGameABI, 'give', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'give'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof tankGameABI, 'give', TMode>({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'give',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"initialize"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameInitialize<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameABI,
          'initialize'
        >['request']['abi'],
        'initialize',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'initialize' }
    : UseContractWriteConfig<typeof tankGameABI, 'initialize', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'initialize'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof tankGameABI, 'initialize', TMode>({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'initialize',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"join"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameJoin<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameABI,
          'join'
        >['request']['abi'],
        'join',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'join' }
    : UseContractWriteConfig<typeof tankGameABI, 'join', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'join'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof tankGameABI, 'join', TMode>({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'join',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"move"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameMove<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameABI,
          'move'
        >['request']['abi'],
        'move',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'move' }
    : UseContractWriteConfig<typeof tankGameABI, 'move', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'move'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof tankGameABI, 'move', TMode>({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'move',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"reveal"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameReveal<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameABI,
          'reveal'
        >['request']['abi'],
        'reveal',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'reveal' }
    : UseContractWriteConfig<typeof tankGameABI, 'reveal', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'reveal'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof tankGameABI, 'reveal', TMode>({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'reveal',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"setOwner"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameSetOwner<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameABI,
          'setOwner'
        >['request']['abi'],
        'setOwner',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setOwner' }
    : UseContractWriteConfig<typeof tankGameABI, 'setOwner', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setOwner'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof tankGameABI, 'setOwner', TMode>({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'setOwner',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"shoot"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameShoot<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameABI,
          'shoot'
        >['request']['abi'],
        'shoot',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'shoot' }
    : UseContractWriteConfig<typeof tankGameABI, 'shoot', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'shoot'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof tankGameABI, 'shoot', TMode>({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'shoot',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"start"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameStart<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameABI,
          'start'
        >['request']['abi'],
        'start',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'start' }
    : UseContractWriteConfig<typeof tankGameABI, 'start', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'start'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof tankGameABI, 'start', TMode>({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'start',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"upgrade"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameUpgrade<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameABI,
          'upgrade'
        >['request']['abi'],
        'upgrade',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'upgrade' }
    : UseContractWriteConfig<typeof tankGameABI, 'upgrade', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'upgrade'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof tankGameABI, 'upgrade', TMode>({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'upgrade',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"vote"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameVote<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tankGameAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameABI,
          'vote'
        >['request']['abi'],
        'vote',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'vote' }
    : UseContractWriteConfig<typeof tankGameABI, 'vote', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'vote'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof tankGameABI, 'vote', TMode>({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'vote',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameABI}__.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareTankGameWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"addHooks"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareTankGameAddHooks(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameABI, 'addHooks'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'addHooks',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameABI, 'addHooks'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"claim"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareTankGameClaim(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameABI, 'claim'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'claim',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameABI, 'claim'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"delegate"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareTankGameDelegate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameABI, 'delegate'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'delegate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameABI, 'delegate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"donate"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareTankGameDonate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameABI, 'donate'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'donate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameABI, 'donate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"drip"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareTankGameDrip(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameABI, 'drip'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'drip',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameABI, 'drip'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"forceAddDefaultHook"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareTankGameForceAddDefaultHook(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameABI, 'forceAddDefaultHook'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'forceAddDefaultHook',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameABI, 'forceAddDefaultHook'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"give"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareTankGameGive(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameABI, 'give'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'give',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameABI, 'give'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"initialize"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareTankGameInitialize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameABI, 'initialize'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameABI, 'initialize'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"join"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareTankGameJoin(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameABI, 'join'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'join',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameABI, 'join'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"move"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareTankGameMove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameABI, 'move'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'move',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameABI, 'move'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"reveal"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareTankGameReveal(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameABI, 'reveal'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'reveal',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameABI, 'reveal'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"setOwner"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareTankGameSetOwner(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameABI, 'setOwner'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'setOwner',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameABI, 'setOwner'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"shoot"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareTankGameShoot(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameABI, 'shoot'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'shoot',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameABI, 'shoot'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"start"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareTankGameStart(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameABI, 'start'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'start',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameABI, 'start'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"upgrade"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareTankGameUpgrade(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameABI, 'upgrade'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'upgrade',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameABI, 'upgrade'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameABI}__ and `functionName` set to `"vote"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function usePrepareTankGameVote(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameABI, 'vote'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    functionName: 'vote',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameABI, 'vote'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameABI}__.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof tankGameABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    ...config,
  } as UseContractEventConfig<typeof tankGameABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameABI}__ and `eventName` set to `"BountyCompleted"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameBountyCompletedEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameABI, 'BountyCompleted'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    eventName: 'BountyCompleted',
    ...config,
  } as UseContractEventConfig<typeof tankGameABI, 'BountyCompleted'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameABI}__ and `eventName` set to `"Claim"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameClaimEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameABI, 'Claim'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    eventName: 'Claim',
    ...config,
  } as UseContractEventConfig<typeof tankGameABI, 'Claim'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameABI}__ and `eventName` set to `"Commit"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameCommitEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameABI, 'Commit'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    eventName: 'Commit',
    ...config,
  } as UseContractEventConfig<typeof tankGameABI, 'Commit'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameABI}__ and `eventName` set to `"Curse"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameCurseEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameABI, 'Curse'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    eventName: 'Curse',
    ...config,
  } as UseContractEventConfig<typeof tankGameABI, 'Curse'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameABI}__ and `eventName` set to `"Death"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameDeathEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameABI, 'Death'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    eventName: 'Death',
    ...config,
  } as UseContractEventConfig<typeof tankGameABI, 'Death'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameABI}__ and `eventName` set to `"Delegate"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameDelegateEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameABI, 'Delegate'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    eventName: 'Delegate',
    ...config,
  } as UseContractEventConfig<typeof tankGameABI, 'Delegate'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameABI}__ and `eventName` set to `"Drip"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameDripEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameABI, 'Drip'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    eventName: 'Drip',
    ...config,
  } as UseContractEventConfig<typeof tankGameABI, 'Drip'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameABI}__ and `eventName` set to `"GameInit"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameGameInitEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameABI, 'GameInit'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    eventName: 'GameInit',
    ...config,
  } as UseContractEventConfig<typeof tankGameABI, 'GameInit'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameABI}__ and `eventName` set to `"GameOver"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameGameOverEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameABI, 'GameOver'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    eventName: 'GameOver',
    ...config,
  } as UseContractEventConfig<typeof tankGameABI, 'GameOver'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameABI}__ and `eventName` set to `"GameStarted"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameGameStartedEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameABI, 'GameStarted'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    eventName: 'GameStarted',
    ...config,
  } as UseContractEventConfig<typeof tankGameABI, 'GameStarted'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameABI}__ and `eventName` set to `"Give"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameGiveEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameABI, 'Give'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    eventName: 'Give',
    ...config,
  } as UseContractEventConfig<typeof tankGameABI, 'Give'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameABI}__ and `eventName` set to `"HooksAdded"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameHooksAddedEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameABI, 'HooksAdded'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    eventName: 'HooksAdded',
    ...config,
  } as UseContractEventConfig<typeof tankGameABI, 'HooksAdded'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameABI}__ and `eventName` set to `"Move"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameMoveEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameABI, 'Move'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    eventName: 'Move',
    ...config,
  } as UseContractEventConfig<typeof tankGameABI, 'Move'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameABI}__ and `eventName` set to `"PlayerJoined"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGamePlayerJoinedEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameABI, 'PlayerJoined'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    eventName: 'PlayerJoined',
    ...config,
  } as UseContractEventConfig<typeof tankGameABI, 'PlayerJoined'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameABI}__ and `eventName` set to `"PrizeIncrease"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGamePrizeIncreaseEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameABI, 'PrizeIncrease'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    eventName: 'PrizeIncrease',
    ...config,
  } as UseContractEventConfig<typeof tankGameABI, 'PrizeIncrease'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameABI}__ and `eventName` set to `"Reveal"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameRevealEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameABI, 'Reveal'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    eventName: 'Reveal',
    ...config,
  } as UseContractEventConfig<typeof tankGameABI, 'Reveal'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameABI}__ and `eventName` set to `"Revive"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameReviveEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameABI, 'Revive'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    eventName: 'Revive',
    ...config,
  } as UseContractEventConfig<typeof tankGameABI, 'Revive'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameABI}__ and `eventName` set to `"Shoot"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameShootEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameABI, 'Shoot'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    eventName: 'Shoot',
    ...config,
  } as UseContractEventConfig<typeof tankGameABI, 'Shoot'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameABI}__ and `eventName` set to `"SpawnHeart"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameSpawnHeartEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameABI, 'SpawnHeart'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    eventName: 'SpawnHeart',
    ...config,
  } as UseContractEventConfig<typeof tankGameABI, 'SpawnHeart'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameABI}__ and `eventName` set to `"Upgrade"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameUpgradeEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameABI, 'Upgrade'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    eventName: 'Upgrade',
    ...config,
  } as UseContractEventConfig<typeof tankGameABI, 'Upgrade'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameABI}__ and `eventName` set to `"Vote"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743)
 * -
 */
export function useTankGameVoteEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameABI, 'Vote'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tankGameAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: tankGameABI,
    address: tankGameAddress[chainId as keyof typeof tankGameAddress],
    eventName: 'Vote',
    ...config,
  } as UseContractEventConfig<typeof tankGameABI, 'Vote'>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameFactoryABI}__.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xaE9036AEB055Fd322dfeaBc53d927EE31ddCca08)
 * -
 */
export function useTankGameFactoryWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tankGameFactoryAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameFactoryABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<
        typeof tankGameFactoryABI,
        TFunctionName,
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof tankGameFactoryABI, TFunctionName, TMode>({
    abi: tankGameFactoryABI,
    address:
      tankGameFactoryAddress[chainId as keyof typeof tankGameFactoryAddress],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameFactoryABI}__ and `functionName` set to `"createGame"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xaE9036AEB055Fd322dfeaBc53d927EE31ddCca08)
 * -
 */
export function useTankGameFactoryCreateGame<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tankGameFactoryAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameFactoryABI,
          'createGame'
        >['request']['abi'],
        'createGame',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'createGame' }
    : UseContractWriteConfig<typeof tankGameFactoryABI, 'createGame', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'createGame'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof tankGameFactoryABI, 'createGame', TMode>({
    abi: tankGameFactoryABI,
    address:
      tankGameFactoryAddress[chainId as keyof typeof tankGameFactoryAddress],
    functionName: 'createGame',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameFactoryABI}__.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xaE9036AEB055Fd322dfeaBc53d927EE31ddCca08)
 * -
 */
export function usePrepareTankGameFactoryWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameFactoryABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof tankGameFactoryAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: tankGameFactoryABI,
    address:
      tankGameFactoryAddress[chainId as keyof typeof tankGameFactoryAddress],
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameFactoryABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameFactoryABI}__ and `functionName` set to `"createGame"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xaE9036AEB055Fd322dfeaBc53d927EE31ddCca08)
 * -
 */
export function usePrepareTankGameFactoryCreateGame(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameFactoryABI, 'createGame'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tankGameFactoryAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: tankGameFactoryABI,
    address:
      tankGameFactoryAddress[chainId as keyof typeof tankGameFactoryAddress],
    functionName: 'createGame',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameFactoryABI, 'createGame'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameFactoryABI}__.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xaE9036AEB055Fd322dfeaBc53d927EE31ddCca08)
 * -
 */
export function useTankGameFactoryEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof tankGameFactoryABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof tankGameFactoryAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: tankGameFactoryABI,
    address:
      tankGameFactoryAddress[chainId as keyof typeof tankGameFactoryAddress],
    ...config,
  } as UseContractEventConfig<typeof tankGameFactoryABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameFactoryABI}__ and `eventName` set to `"GameCreated"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xaE9036AEB055Fd322dfeaBc53d927EE31ddCca08)
 * -
 */
export function useTankGameFactoryGameCreatedEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameFactoryABI, 'GameCreated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tankGameFactoryAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: tankGameFactoryABI,
    address:
      tankGameFactoryAddress[chainId as keyof typeof tankGameFactoryAddress],
    eventName: 'GameCreated',
    ...config,
  } as UseContractEventConfig<typeof tankGameFactoryABI, 'GameCreated'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__.
 */
export function useTankGameLogicRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"aliveTanksIdSum"`.
 */
export function useTankGameLogicAliveTanksIdSum<
  TFunctionName extends 'aliveTanksIdSum',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'aliveTanksIdSum',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"board"`.
 */
export function useTankGameLogicBoard<
  TFunctionName extends 'board',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'board',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"claimed"`.
 */
export function useTankGameLogicClaimed<
  TFunctionName extends 'claimed',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'claimed',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"deadTanks"`.
 */
export function useTankGameLogicDeadTanks<
  TFunctionName extends 'deadTanks',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'deadTanks',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"delegates"`.
 */
export function useTankGameLogicDelegates<
  TFunctionName extends 'delegates',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'delegates',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"epochStart"`.
 */
export function useTankGameLogicEpochStart<
  TFunctionName extends 'epochStart',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'epochStart',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"getBoard"`.
 */
export function useTankGameLogicGetBoard<
  TFunctionName extends 'getBoard',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'getBoard',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"getEpoch"`.
 */
export function useTankGameLogicGetEpoch<
  TFunctionName extends 'getEpoch',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'getEpoch',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"getLastDrip"`.
 */
export function useTankGameLogicGetLastDrip<
  TFunctionName extends 'getLastDrip',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'getLastDrip',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"getPlayerCount"`.
 */
export function useTankGameLogicGetPlayerCount<
  TFunctionName extends 'getPlayerCount',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'getPlayerCount',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"getSettings"`.
 */
export function useTankGameLogicGetSettings<
  TFunctionName extends 'getSettings',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'getSettings',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"getState"`.
 */
export function useTankGameLogicGetState<
  TFunctionName extends 'getState',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'getState',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"getTank"`.
 */
export function useTankGameLogicGetTank<
  TFunctionName extends 'getTank',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'getTank',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"getUpgradeCost"`.
 */
export function useTankGameLogicGetUpgradeCost<
  TFunctionName extends 'getUpgradeCost',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'getUpgradeCost',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"heartsOnBoard"`.
 */
export function useTankGameLogicHeartsOnBoard<
  TFunctionName extends 'heartsOnBoard',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'heartsOnBoard',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"isAuth"`.
 */
export function useTankGameLogicIsAuth<
  TFunctionName extends 'isAuth',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'isAuth',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"lastDripEpoch"`.
 */
export function useTankGameLogicLastDripEpoch<
  TFunctionName extends 'lastDripEpoch',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'lastDripEpoch',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"lastRevealBlock"`.
 */
export function useTankGameLogicLastRevealBlock<
  TFunctionName extends 'lastRevealBlock',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'lastRevealBlock',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"numTanksAlive"`.
 */
export function useTankGameLogicNumTanksAlive<
  TFunctionName extends 'numTanksAlive',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'numTanksAlive',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"owner"`.
 */
export function useTankGameLogicOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"players"`.
 */
export function useTankGameLogicPlayers<
  TFunctionName extends 'players',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'players',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"playersCount"`.
 */
export function useTankGameLogicPlayersCount<
  TFunctionName extends 'playersCount',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'playersCount',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"podium"`.
 */
export function useTankGameLogicPodium<
  TFunctionName extends 'podium',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'podium',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"prizePool"`.
 */
export function useTankGameLogicPrizePool<
  TFunctionName extends 'prizePool',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'prizePool',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"revealBlock"`.
 */
export function useTankGameLogicRevealBlock<
  TFunctionName extends 'revealBlock',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'revealBlock',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"settings"`.
 */
export function useTankGameLogicSettings<
  TFunctionName extends 'settings',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'settings',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"state"`.
 */
export function useTankGameLogicState<
  TFunctionName extends 'state',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'state',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"stateData"`.
 */
export function useTankGameLogicStateData<
  TFunctionName extends 'stateData',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'stateData',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"tankHooks"`.
 */
export function useTankGameLogicTankHooks<
  TFunctionName extends 'tankHooks',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'tankHooks',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"tankToPosition"`.
 */
export function useTankGameLogicTankToPosition<
  TFunctionName extends 'tankToPosition',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'tankToPosition',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"tanks"`.
 */
export function useTankGameLogicTanks<
  TFunctionName extends 'tanks',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'tanks',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"tanksOnBoard"`.
 */
export function useTankGameLogicTanksOnBoard<
  TFunctionName extends 'tanksOnBoard',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'tanksOnBoard',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"votedThisEpoch"`.
 */
export function useTankGameLogicVotedThisEpoch<
  TFunctionName extends 'votedThisEpoch',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'votedThisEpoch',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"votesPerEpoch"`.
 */
export function useTankGameLogicVotesPerEpoch<
  TFunctionName extends 'votesPerEpoch',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'votesPerEpoch',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"votingClosed"`.
 */
export function useTankGameLogicVotingClosed<
  TFunctionName extends 'votingClosed',
  TSelectData = ReadContractResult<typeof tankGameLogicABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tankGameLogicABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameLogicABI,
    functionName: 'votingClosed',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameLogicABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__.
 */
export function useTankGameLogicWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameLogicABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof tankGameLogicABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof tankGameLogicABI, TFunctionName, TMode>({
    abi: tankGameLogicABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"addHooks"`.
 */
export function useTankGameLogicAddHooks<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameLogicABI,
          'addHooks'
        >['request']['abi'],
        'addHooks',
        TMode
      > & { functionName?: 'addHooks' }
    : UseContractWriteConfig<typeof tankGameLogicABI, 'addHooks', TMode> & {
        abi?: never
        functionName?: 'addHooks'
      } = {} as any,
) {
  return useContractWrite<typeof tankGameLogicABI, 'addHooks', TMode>({
    abi: tankGameLogicABI,
    functionName: 'addHooks',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"claim"`.
 */
export function useTankGameLogicClaim<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameLogicABI,
          'claim'
        >['request']['abi'],
        'claim',
        TMode
      > & { functionName?: 'claim' }
    : UseContractWriteConfig<typeof tankGameLogicABI, 'claim', TMode> & {
        abi?: never
        functionName?: 'claim'
      } = {} as any,
) {
  return useContractWrite<typeof tankGameLogicABI, 'claim', TMode>({
    abi: tankGameLogicABI,
    functionName: 'claim',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"delegate"`.
 */
export function useTankGameLogicDelegate<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameLogicABI,
          'delegate'
        >['request']['abi'],
        'delegate',
        TMode
      > & { functionName?: 'delegate' }
    : UseContractWriteConfig<typeof tankGameLogicABI, 'delegate', TMode> & {
        abi?: never
        functionName?: 'delegate'
      } = {} as any,
) {
  return useContractWrite<typeof tankGameLogicABI, 'delegate', TMode>({
    abi: tankGameLogicABI,
    functionName: 'delegate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"donate"`.
 */
export function useTankGameLogicDonate<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameLogicABI,
          'donate'
        >['request']['abi'],
        'donate',
        TMode
      > & { functionName?: 'donate' }
    : UseContractWriteConfig<typeof tankGameLogicABI, 'donate', TMode> & {
        abi?: never
        functionName?: 'donate'
      } = {} as any,
) {
  return useContractWrite<typeof tankGameLogicABI, 'donate', TMode>({
    abi: tankGameLogicABI,
    functionName: 'donate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"drip"`.
 */
export function useTankGameLogicDrip<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameLogicABI,
          'drip'
        >['request']['abi'],
        'drip',
        TMode
      > & { functionName?: 'drip' }
    : UseContractWriteConfig<typeof tankGameLogicABI, 'drip', TMode> & {
        abi?: never
        functionName?: 'drip'
      } = {} as any,
) {
  return useContractWrite<typeof tankGameLogicABI, 'drip', TMode>({
    abi: tankGameLogicABI,
    functionName: 'drip',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"forceAddDefaultHook"`.
 */
export function useTankGameLogicForceAddDefaultHook<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameLogicABI,
          'forceAddDefaultHook'
        >['request']['abi'],
        'forceAddDefaultHook',
        TMode
      > & { functionName?: 'forceAddDefaultHook' }
    : UseContractWriteConfig<
        typeof tankGameLogicABI,
        'forceAddDefaultHook',
        TMode
      > & {
        abi?: never
        functionName?: 'forceAddDefaultHook'
      } = {} as any,
) {
  return useContractWrite<
    typeof tankGameLogicABI,
    'forceAddDefaultHook',
    TMode
  >({
    abi: tankGameLogicABI,
    functionName: 'forceAddDefaultHook',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"give"`.
 */
export function useTankGameLogicGive<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameLogicABI,
          'give'
        >['request']['abi'],
        'give',
        TMode
      > & { functionName?: 'give' }
    : UseContractWriteConfig<typeof tankGameLogicABI, 'give', TMode> & {
        abi?: never
        functionName?: 'give'
      } = {} as any,
) {
  return useContractWrite<typeof tankGameLogicABI, 'give', TMode>({
    abi: tankGameLogicABI,
    functionName: 'give',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"join"`.
 */
export function useTankGameLogicJoin<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameLogicABI,
          'join'
        >['request']['abi'],
        'join',
        TMode
      > & { functionName?: 'join' }
    : UseContractWriteConfig<typeof tankGameLogicABI, 'join', TMode> & {
        abi?: never
        functionName?: 'join'
      } = {} as any,
) {
  return useContractWrite<typeof tankGameLogicABI, 'join', TMode>({
    abi: tankGameLogicABI,
    functionName: 'join',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"move"`.
 */
export function useTankGameLogicMove<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameLogicABI,
          'move'
        >['request']['abi'],
        'move',
        TMode
      > & { functionName?: 'move' }
    : UseContractWriteConfig<typeof tankGameLogicABI, 'move', TMode> & {
        abi?: never
        functionName?: 'move'
      } = {} as any,
) {
  return useContractWrite<typeof tankGameLogicABI, 'move', TMode>({
    abi: tankGameLogicABI,
    functionName: 'move',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"reveal"`.
 */
export function useTankGameLogicReveal<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameLogicABI,
          'reveal'
        >['request']['abi'],
        'reveal',
        TMode
      > & { functionName?: 'reveal' }
    : UseContractWriteConfig<typeof tankGameLogicABI, 'reveal', TMode> & {
        abi?: never
        functionName?: 'reveal'
      } = {} as any,
) {
  return useContractWrite<typeof tankGameLogicABI, 'reveal', TMode>({
    abi: tankGameLogicABI,
    functionName: 'reveal',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"setOwner"`.
 */
export function useTankGameLogicSetOwner<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameLogicABI,
          'setOwner'
        >['request']['abi'],
        'setOwner',
        TMode
      > & { functionName?: 'setOwner' }
    : UseContractWriteConfig<typeof tankGameLogicABI, 'setOwner', TMode> & {
        abi?: never
        functionName?: 'setOwner'
      } = {} as any,
) {
  return useContractWrite<typeof tankGameLogicABI, 'setOwner', TMode>({
    abi: tankGameLogicABI,
    functionName: 'setOwner',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"shoot"`.
 */
export function useTankGameLogicShoot<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameLogicABI,
          'shoot'
        >['request']['abi'],
        'shoot',
        TMode
      > & { functionName?: 'shoot' }
    : UseContractWriteConfig<typeof tankGameLogicABI, 'shoot', TMode> & {
        abi?: never
        functionName?: 'shoot'
      } = {} as any,
) {
  return useContractWrite<typeof tankGameLogicABI, 'shoot', TMode>({
    abi: tankGameLogicABI,
    functionName: 'shoot',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"upgrade"`.
 */
export function useTankGameLogicUpgrade<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameLogicABI,
          'upgrade'
        >['request']['abi'],
        'upgrade',
        TMode
      > & { functionName?: 'upgrade' }
    : UseContractWriteConfig<typeof tankGameLogicABI, 'upgrade', TMode> & {
        abi?: never
        functionName?: 'upgrade'
      } = {} as any,
) {
  return useContractWrite<typeof tankGameLogicABI, 'upgrade', TMode>({
    abi: tankGameLogicABI,
    functionName: 'upgrade',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"vote"`.
 */
export function useTankGameLogicVote<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tankGameLogicABI,
          'vote'
        >['request']['abi'],
        'vote',
        TMode
      > & { functionName?: 'vote' }
    : UseContractWriteConfig<typeof tankGameLogicABI, 'vote', TMode> & {
        abi?: never
        functionName?: 'vote'
      } = {} as any,
) {
  return useContractWrite<typeof tankGameLogicABI, 'vote', TMode>({
    abi: tankGameLogicABI,
    functionName: 'vote',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__.
 */
export function usePrepareTankGameLogicWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameLogicABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tankGameLogicABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameLogicABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"addHooks"`.
 */
export function usePrepareTankGameLogicAddHooks(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameLogicABI, 'addHooks'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tankGameLogicABI,
    functionName: 'addHooks',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameLogicABI, 'addHooks'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"claim"`.
 */
export function usePrepareTankGameLogicClaim(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameLogicABI, 'claim'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tankGameLogicABI,
    functionName: 'claim',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameLogicABI, 'claim'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"delegate"`.
 */
export function usePrepareTankGameLogicDelegate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameLogicABI, 'delegate'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tankGameLogicABI,
    functionName: 'delegate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameLogicABI, 'delegate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"donate"`.
 */
export function usePrepareTankGameLogicDonate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameLogicABI, 'donate'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tankGameLogicABI,
    functionName: 'donate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameLogicABI, 'donate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"drip"`.
 */
export function usePrepareTankGameLogicDrip(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameLogicABI, 'drip'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tankGameLogicABI,
    functionName: 'drip',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameLogicABI, 'drip'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"forceAddDefaultHook"`.
 */
export function usePrepareTankGameLogicForceAddDefaultHook(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tankGameLogicABI,
      'forceAddDefaultHook'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tankGameLogicABI,
    functionName: 'forceAddDefaultHook',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof tankGameLogicABI,
    'forceAddDefaultHook'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"give"`.
 */
export function usePrepareTankGameLogicGive(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameLogicABI, 'give'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tankGameLogicABI,
    functionName: 'give',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameLogicABI, 'give'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"join"`.
 */
export function usePrepareTankGameLogicJoin(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameLogicABI, 'join'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tankGameLogicABI,
    functionName: 'join',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameLogicABI, 'join'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"move"`.
 */
export function usePrepareTankGameLogicMove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameLogicABI, 'move'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tankGameLogicABI,
    functionName: 'move',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameLogicABI, 'move'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"reveal"`.
 */
export function usePrepareTankGameLogicReveal(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameLogicABI, 'reveal'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tankGameLogicABI,
    functionName: 'reveal',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameLogicABI, 'reveal'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"setOwner"`.
 */
export function usePrepareTankGameLogicSetOwner(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameLogicABI, 'setOwner'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tankGameLogicABI,
    functionName: 'setOwner',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameLogicABI, 'setOwner'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"shoot"`.
 */
export function usePrepareTankGameLogicShoot(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameLogicABI, 'shoot'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tankGameLogicABI,
    functionName: 'shoot',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameLogicABI, 'shoot'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"upgrade"`.
 */
export function usePrepareTankGameLogicUpgrade(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameLogicABI, 'upgrade'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tankGameLogicABI,
    functionName: 'upgrade',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameLogicABI, 'upgrade'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tankGameLogicABI}__ and `functionName` set to `"vote"`.
 */
export function usePrepareTankGameLogicVote(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tankGameLogicABI, 'vote'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tankGameLogicABI,
    functionName: 'vote',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tankGameLogicABI, 'vote'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameLogicABI}__.
 */
export function useTankGameLogicEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof tankGameLogicABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({
    abi: tankGameLogicABI,
    ...config,
  } as UseContractEventConfig<typeof tankGameLogicABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameLogicABI}__ and `eventName` set to `"BountyCompleted"`.
 */
export function useTankGameLogicBountyCompletedEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameLogicABI, 'BountyCompleted'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tankGameLogicABI,
    eventName: 'BountyCompleted',
    ...config,
  } as UseContractEventConfig<typeof tankGameLogicABI, 'BountyCompleted'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameLogicABI}__ and `eventName` set to `"Claim"`.
 */
export function useTankGameLogicClaimEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameLogicABI, 'Claim'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tankGameLogicABI,
    eventName: 'Claim',
    ...config,
  } as UseContractEventConfig<typeof tankGameLogicABI, 'Claim'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameLogicABI}__ and `eventName` set to `"Commit"`.
 */
export function useTankGameLogicCommitEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameLogicABI, 'Commit'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tankGameLogicABI,
    eventName: 'Commit',
    ...config,
  } as UseContractEventConfig<typeof tankGameLogicABI, 'Commit'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameLogicABI}__ and `eventName` set to `"Curse"`.
 */
export function useTankGameLogicCurseEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameLogicABI, 'Curse'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tankGameLogicABI,
    eventName: 'Curse',
    ...config,
  } as UseContractEventConfig<typeof tankGameLogicABI, 'Curse'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameLogicABI}__ and `eventName` set to `"Death"`.
 */
export function useTankGameLogicDeathEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameLogicABI, 'Death'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tankGameLogicABI,
    eventName: 'Death',
    ...config,
  } as UseContractEventConfig<typeof tankGameLogicABI, 'Death'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameLogicABI}__ and `eventName` set to `"Delegate"`.
 */
export function useTankGameLogicDelegateEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameLogicABI, 'Delegate'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tankGameLogicABI,
    eventName: 'Delegate',
    ...config,
  } as UseContractEventConfig<typeof tankGameLogicABI, 'Delegate'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameLogicABI}__ and `eventName` set to `"Drip"`.
 */
export function useTankGameLogicDripEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameLogicABI, 'Drip'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tankGameLogicABI,
    eventName: 'Drip',
    ...config,
  } as UseContractEventConfig<typeof tankGameLogicABI, 'Drip'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameLogicABI}__ and `eventName` set to `"GameInit"`.
 */
export function useTankGameLogicGameInitEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameLogicABI, 'GameInit'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tankGameLogicABI,
    eventName: 'GameInit',
    ...config,
  } as UseContractEventConfig<typeof tankGameLogicABI, 'GameInit'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameLogicABI}__ and `eventName` set to `"GameOver"`.
 */
export function useTankGameLogicGameOverEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameLogicABI, 'GameOver'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tankGameLogicABI,
    eventName: 'GameOver',
    ...config,
  } as UseContractEventConfig<typeof tankGameLogicABI, 'GameOver'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameLogicABI}__ and `eventName` set to `"GameStarted"`.
 */
export function useTankGameLogicGameStartedEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameLogicABI, 'GameStarted'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tankGameLogicABI,
    eventName: 'GameStarted',
    ...config,
  } as UseContractEventConfig<typeof tankGameLogicABI, 'GameStarted'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameLogicABI}__ and `eventName` set to `"Give"`.
 */
export function useTankGameLogicGiveEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameLogicABI, 'Give'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tankGameLogicABI,
    eventName: 'Give',
    ...config,
  } as UseContractEventConfig<typeof tankGameLogicABI, 'Give'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameLogicABI}__ and `eventName` set to `"HooksAdded"`.
 */
export function useTankGameLogicHooksAddedEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameLogicABI, 'HooksAdded'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tankGameLogicABI,
    eventName: 'HooksAdded',
    ...config,
  } as UseContractEventConfig<typeof tankGameLogicABI, 'HooksAdded'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameLogicABI}__ and `eventName` set to `"Move"`.
 */
export function useTankGameLogicMoveEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameLogicABI, 'Move'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tankGameLogicABI,
    eventName: 'Move',
    ...config,
  } as UseContractEventConfig<typeof tankGameLogicABI, 'Move'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameLogicABI}__ and `eventName` set to `"PlayerJoined"`.
 */
export function useTankGameLogicPlayerJoinedEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameLogicABI, 'PlayerJoined'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tankGameLogicABI,
    eventName: 'PlayerJoined',
    ...config,
  } as UseContractEventConfig<typeof tankGameLogicABI, 'PlayerJoined'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameLogicABI}__ and `eventName` set to `"PrizeIncrease"`.
 */
export function useTankGameLogicPrizeIncreaseEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameLogicABI, 'PrizeIncrease'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tankGameLogicABI,
    eventName: 'PrizeIncrease',
    ...config,
  } as UseContractEventConfig<typeof tankGameLogicABI, 'PrizeIncrease'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameLogicABI}__ and `eventName` set to `"Reveal"`.
 */
export function useTankGameLogicRevealEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameLogicABI, 'Reveal'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tankGameLogicABI,
    eventName: 'Reveal',
    ...config,
  } as UseContractEventConfig<typeof tankGameLogicABI, 'Reveal'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameLogicABI}__ and `eventName` set to `"Revive"`.
 */
export function useTankGameLogicReviveEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameLogicABI, 'Revive'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tankGameLogicABI,
    eventName: 'Revive',
    ...config,
  } as UseContractEventConfig<typeof tankGameLogicABI, 'Revive'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameLogicABI}__ and `eventName` set to `"Shoot"`.
 */
export function useTankGameLogicShootEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameLogicABI, 'Shoot'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tankGameLogicABI,
    eventName: 'Shoot',
    ...config,
  } as UseContractEventConfig<typeof tankGameLogicABI, 'Shoot'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameLogicABI}__ and `eventName` set to `"SpawnHeart"`.
 */
export function useTankGameLogicSpawnHeartEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameLogicABI, 'SpawnHeart'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tankGameLogicABI,
    eventName: 'SpawnHeart',
    ...config,
  } as UseContractEventConfig<typeof tankGameLogicABI, 'SpawnHeart'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameLogicABI}__ and `eventName` set to `"Upgrade"`.
 */
export function useTankGameLogicUpgradeEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameLogicABI, 'Upgrade'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tankGameLogicABI,
    eventName: 'Upgrade',
    ...config,
  } as UseContractEventConfig<typeof tankGameLogicABI, 'Upgrade'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tankGameLogicABI}__ and `eventName` set to `"Vote"`.
 */
export function useTankGameLogicVoteEvent(
  config: Omit<
    UseContractEventConfig<typeof tankGameLogicABI, 'Vote'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tankGameLogicABI,
    eventName: 'Vote',
    ...config,
  } as UseContractEventConfig<typeof tankGameLogicABI, 'Vote'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__.
 */
export function useTankGameV2StorageRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__ and `functionName` set to `"aliveTanksIdSum"`.
 */
export function useTankGameV2StorageAliveTanksIdSum<
  TFunctionName extends 'aliveTanksIdSum',
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    functionName: 'aliveTanksIdSum',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__ and `functionName` set to `"board"`.
 */
export function useTankGameV2StorageBoard<
  TFunctionName extends 'board',
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    functionName: 'board',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__ and `functionName` set to `"claimed"`.
 */
export function useTankGameV2StorageClaimed<
  TFunctionName extends 'claimed',
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    functionName: 'claimed',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__ and `functionName` set to `"deadTanks"`.
 */
export function useTankGameV2StorageDeadTanks<
  TFunctionName extends 'deadTanks',
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    functionName: 'deadTanks',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__ and `functionName` set to `"delegates"`.
 */
export function useTankGameV2StorageDelegates<
  TFunctionName extends 'delegates',
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    functionName: 'delegates',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__ and `functionName` set to `"epochStart"`.
 */
export function useTankGameV2StorageEpochStart<
  TFunctionName extends 'epochStart',
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    functionName: 'epochStart',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__ and `functionName` set to `"heartsOnBoard"`.
 */
export function useTankGameV2StorageHeartsOnBoard<
  TFunctionName extends 'heartsOnBoard',
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    functionName: 'heartsOnBoard',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__ and `functionName` set to `"lastDripEpoch"`.
 */
export function useTankGameV2StorageLastDripEpoch<
  TFunctionName extends 'lastDripEpoch',
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    functionName: 'lastDripEpoch',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__ and `functionName` set to `"lastRevealBlock"`.
 */
export function useTankGameV2StorageLastRevealBlock<
  TFunctionName extends 'lastRevealBlock',
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    functionName: 'lastRevealBlock',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__ and `functionName` set to `"numTanksAlive"`.
 */
export function useTankGameV2StorageNumTanksAlive<
  TFunctionName extends 'numTanksAlive',
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    functionName: 'numTanksAlive',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__ and `functionName` set to `"owner"`.
 */
export function useTankGameV2StorageOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__ and `functionName` set to `"players"`.
 */
export function useTankGameV2StoragePlayers<
  TFunctionName extends 'players',
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    functionName: 'players',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__ and `functionName` set to `"playersCount"`.
 */
export function useTankGameV2StoragePlayersCount<
  TFunctionName extends 'playersCount',
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    functionName: 'playersCount',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__ and `functionName` set to `"podium"`.
 */
export function useTankGameV2StoragePodium<
  TFunctionName extends 'podium',
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    functionName: 'podium',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__ and `functionName` set to `"prizePool"`.
 */
export function useTankGameV2StoragePrizePool<
  TFunctionName extends 'prizePool',
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    functionName: 'prizePool',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__ and `functionName` set to `"revealBlock"`.
 */
export function useTankGameV2StorageRevealBlock<
  TFunctionName extends 'revealBlock',
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    functionName: 'revealBlock',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__ and `functionName` set to `"settings"`.
 */
export function useTankGameV2StorageSettings<
  TFunctionName extends 'settings',
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    functionName: 'settings',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__ and `functionName` set to `"state"`.
 */
export function useTankGameV2StorageState<
  TFunctionName extends 'state',
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    functionName: 'state',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__ and `functionName` set to `"stateData"`.
 */
export function useTankGameV2StorageStateData<
  TFunctionName extends 'stateData',
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    functionName: 'stateData',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__ and `functionName` set to `"tankHooks"`.
 */
export function useTankGameV2StorageTankHooks<
  TFunctionName extends 'tankHooks',
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    functionName: 'tankHooks',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__ and `functionName` set to `"tankToPosition"`.
 */
export function useTankGameV2StorageTankToPosition<
  TFunctionName extends 'tankToPosition',
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    functionName: 'tankToPosition',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__ and `functionName` set to `"tanks"`.
 */
export function useTankGameV2StorageTanks<
  TFunctionName extends 'tanks',
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    functionName: 'tanks',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__ and `functionName` set to `"tanksOnBoard"`.
 */
export function useTankGameV2StorageTanksOnBoard<
  TFunctionName extends 'tanksOnBoard',
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    functionName: 'tanksOnBoard',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__ and `functionName` set to `"votedThisEpoch"`.
 */
export function useTankGameV2StorageVotedThisEpoch<
  TFunctionName extends 'votedThisEpoch',
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    functionName: 'votedThisEpoch',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__ and `functionName` set to `"votesPerEpoch"`.
 */
export function useTankGameV2StorageVotesPerEpoch<
  TFunctionName extends 'votesPerEpoch',
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    functionName: 'votesPerEpoch',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tankGameV2StorageABI}__ and `functionName` set to `"votingClosed"`.
 */
export function useTankGameV2StorageVotingClosed<
  TFunctionName extends 'votingClosed',
  TSelectData = ReadContractResult<typeof tankGameV2StorageABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tankGameV2StorageABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tankGameV2StorageABI,
    functionName: 'votingClosed',
    ...config,
  } as UseContractReadConfig<
    typeof tankGameV2StorageABI,
    TFunctionName,
    TSelectData
  >)
}
