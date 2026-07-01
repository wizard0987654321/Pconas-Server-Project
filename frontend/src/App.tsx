import { useEffect } from 'react'
import './App.css'
import { getHealth, getRoomData, getTestMessage } from './services/api'


function App() {

  useEffect(() => {
    getHealth()
      .then((data) => {
        console.log("API Response is aaeee:", data);
      })
      .catch((err) => {
        console.error("API erroria aee:", err)
      })
  }, []);

  useEffect(() => {
    getTestMessage()
      .then((data) => {
        console.log("API Response is testistvis:", data);
      })
      .catch((err) => {
        console.error("API erroria aee:", err)
      })
  }, []);

  useEffect(() => {
    getRoomData()
      .then((data) => {
        console.log("API Response is sqlistvis:", data);
      })
      .catch((err) => {
        console.error("API erroria aee:", err)
      })
  }, []);

  return (
    <>
      <h1 className="text-red-600">This is Heading</h1>
    </>
  )
}

export default App
