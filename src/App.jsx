import { useState, useEffect, useCallback } from 'react'
import { io } from 'socket.io-client'

const TOTAL_FLOORS = 10

const Notification = ({ notification, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => onRemove(notification.id), 300) // Wait for fade animation
    }, 5000)

    return () => clearTimeout(timer)
  }, [notification.id, onRemove])

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 mb-3 border border-gray-200 transition-all duration-300 ${
      isExiting ? 'opacity-0 translate-x-full' : 'animate-slide-in opacity-100'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-medium text-gray-900 text-sm">
            {notification.type === 'request' ? '📋 New Request' : '✅ Request Fulfilled'}
          </p>
          <p className="text-gray-600 text-sm mt-1">
            {notification.message}
          </p>
        </div>
        <button
          onClick={() => {
            setIsExiting(true)
            setTimeout(() => onRemove(notification.id), 300)
          }}
          className="text-gray-400 hover:text-gray-600 ml-3"
        >
          ×
        </button>
      </div>
    </div>
  )
}

const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [currentFloor, setCurrentFloor] = useState(1)
  const [direction, setDirection] = useState('up')
  const [destinationFloor, setDestinationFloor] = useState(null)

  if (!isOpen) return null

  const handleSubmit = () => {
    if (destinationFloor !== null && destinationFloor !== currentFloor) {
      onSubmit({
        fromFloor: currentFloor,
        direction: direction,
        toFloor: destinationFloor
      })
      // Reset form
      setCurrentFloor(1)
      setDirection('up')
      setDestinationFloor(null)
      onClose()
    }
  }

  const handleDestinationClick = (floor) => {
    if (floor === currentFloor) return
    
    if (direction === 'up' && floor <= currentFloor) return
    
    if (direction === 'down' && floor >= currentFloor) return
    
    setDestinationFloor(floor)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg w-[500px] max-w-[90vw] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-medium">Make a Request</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">

          <div>
            <label className="block font-medium text-gray-700 mb-3">
              I'm on floor:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: TOTAL_FLOORS }, (_, i) => {
                const floor = i + 1
                const isSelected = currentFloor === floor
                return (
                  <button
                    key={floor}
                    onClick={() => {
                      setCurrentFloor(floor)
                      setDestinationFloor(null)
                    }}
                    className={`h-20 rounded-md font-medium transition-colors ${
                      isSelected
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {floor}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-3">
              I want to go:
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDirection('up')
                  setDestinationFloor(null)
                }}
                className={`flex-1 h-16 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                  direction === 'up'
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <span>↑</span>
                <span>Up</span>
              </button>
              <button
                onClick={() => {
                  setDirection('down')
                  setDestinationFloor(null)
                }}
                className={`flex-1 h-16 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                  direction === 'down'
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <span>↓</span>
                <span>Down</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-3">
              To floor:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: TOTAL_FLOORS }, (_, i) => {
                const floor = i + 1
                const isSelected = destinationFloor === floor
                const isDisabled = 
                  floor === currentFloor || 
                  (direction === 'up' && floor <= currentFloor) ||
                  (direction === 'down' && floor >= currentFloor)
                
                return (
                  <button
                    key={floor}
                    onClick={() => handleDestinationClick(floor)}
                    disabled={isDisabled}
                    className={`h-20 rounded-md font-medium transition-colors ${
                      isDisabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isSelected
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {floor}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="p-6 border-t">
          <button
            onClick={handleSubmit}
            disabled={destinationFloor === null}
            className={`w-full h-12 rounded-md font-medium transition-colors ${
              destinationFloor === null
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-900'
            }`}
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [elevators, setElevators] = useState([
    { id: 1, currentFloor: 1, status: 'idle', direction: 'none', queueLength: 0 },
    { id: 2, currentFloor: 5, status: 'idle', direction: 'none', queueLength: 0 }
  ])
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');

    newSocket.on('connect', () => {
      console.log('connecetd to server')
    })

    newSocket.on('disconnect', () => {
      console.log('diconnected from server')
    })

    newSocket.on('elevatorStateUpdate', (data) => {
      console.log('Elevator state update: ' + data);
      setElevators(data.elevators);
    })

    // NEW: Listen for request confirmation
    newSocket.on('requestReceived', (data) => {
      addNotification('request', `Floor ${data.fromFloor} → Floor ${data.toFloor}`);
    })

    // NEW: Listen for request fulfillment
    newSocket.on('requestFulfilled', (data) => {
      addNotification('fulfilled', `Elevator ${data.elevatorId} completed: Floor ${data.fromFloor} → Floor ${data.toFloor}`);
    })

    setSocket(newSocket)

    return () => {
      newSocket.close();
    }
  }, [])

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmitRequest = (request) => {
    console.log('Request submitted:', request)
    
    if (socket) {
      socket.emit('elevatorRequest', request);
    }
  }

  const getStatusText = (elevator) => {
    if (elevator.status === 'idle') return 'Waiting';
    if (elevator.status === 'loading') return 'Door Action';
    if (elevator.status === 'moving') {
      if (elevator.direction === 'up') return 'Going up';
      if (elevator.direction === 'down') return 'Going down';
    }
    return elevator.status;
  }

  const addNotification = (type, message) => {
    const notification = {
      id: Date.now() + Math.random(), // Unique ID
      type,
      message,
      timestamp: Date.now()
    }
    setNotifications(prev => [notification, ...prev])
  }

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen mt-[-3rem]">
        <div className="flex flex-col justify-center items-center">
          <p className="font-medium mb-3 text-2xl">
            Global Elevator System
          </p>
          <p className="">
            <span className="italic">Everyone in the world</span> shares these 2 elevators.
          </p>
        </div>
        <div>
          <div className="mt-[6rem] h-[25rem] flex flex-col justify-center items-center">
            <div className="flex flex-row gap-10 shadow-[0_0_3px_rgba(0,0,0,0.2)] rounded-2xl w-[37rem] h-[21rem] justify-center items-center">
              <div className="flex items-center justify-center flex-col">
                <div className="bg-gray-200 rounded-2xl py-[0.5rem] px-[1rem] mb-[1rem] mt-[2rem]">
                  <p className="">
                    Elevator 1:
                  </p>
                </div>
                <div className="bg-black h-[15rem] w-[15rem] rounded-2xl flex flex-col justify-center items-center mb-[2rem]">
                  <div>
                    <p className="text-[7rem] text-white">
                      {elevators[0].currentFloor}
                    </p>
                  </div>
                  <div>
                    <p className="uppercase text-white text-gray-500 mb-8">
                      {getStatusText(elevators[0])}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center flex-col">
                <div className="bg-gray-200 rounded-2xl py-[0.5rem] px-[1rem] mb-[1rem] mt-[2rem]">
                  <p className="">
                    Elevator 2:
                  </p>
                </div>
                <div className="bg-black h-[15rem] w-[15rem] rounded-2xl flex flex-col justify-center items-center mb-[2rem]">
                  <div>
                    <p className="text-[7rem] text-white">
                      {elevators[1].currentFloor}
                    </p>
                  </div>
                  <div>
                    <p className="uppercase text-white text-gray-500 mb-8">
                      {getStatusText(elevators[1])}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-10 shadow-[0_0_3px_rgba(0,0,0,0.2)] rounded-2xl w-[37rem] h-[7rem] justify-center items-center mt-6">
              <button className="w-[32.5rem] h-[3.5rem] bg-black rounded-2xl mt-8 hover:bg-gray-900 transition-colors duration-150 mb-[2rem]" onClick={openModal}>
                <p className="text-white text-md">
                  Make a Request
                </p>
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center flex-col">
          <p className="text-[0.8rem] mt-[5rem] text-gray-600 text-center">
            Click to request the elevator
          </p>
          <p className="text-[0.65rem] mt-[2rem] text-gray-600 text-center">
            (fun fact: this uses the world's *fastest* 2-elevator algorithm)
          </p>
        </div>

        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            onSubmit={handleSubmitRequest}
          />
        )}
      </div>
      
      <div className="fixed bottom-4 right-4 w-80 max-h-[80vh] overflow-y-auto z-50">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </div>
    </>
  )
}

export default App