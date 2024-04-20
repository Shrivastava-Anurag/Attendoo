import Home from "../components/Home";
import {useSelector } from 'react-redux'

function HomePage() {
    // const token = useSelector(state => state.token);
    // console.log(token)
    return (
        <div>
        <Home />
        </div>
    )
}

export default HomePage;