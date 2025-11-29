import { useState } from 'react'

const TOTAL_FLOORS = 10

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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmitRequest = (request) => {
    console.log('Request submitted:', request)
    // TODO: Emit to WebSocket server
    // socket.emit('requestElevator', request)
  }

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
                      1
                    </p>
                  </div>
                  <div>
                    <p className="uppercase text-white text-gray-500 mb-8">
                      waiting
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
                      5
                    </p>
                  </div>
                  <div>
                    <p className="uppercase text-white text-gray-500 mb-8">
                      waiting
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
        <div>
          <p className="text-[0.8rem] mt-[5rem] text-gray-600">
            Click to request the elevator
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
      
    </>
  )
}

export default App