import {useState, useEffect, useRef} from "react"
import DieCell from "./DieCell"
import Confetti from 'react-confetti'

export default function Die(){

    const [dieData, setDieData] = useState(JSON.parse(localStorage.getItem("dataDieSave")) || allNewDice())
    const [tenzies, setTenzies] = useState(false)
    const [yourScore, setYourScore] = useState(JSON.parse(localStorage.getItem("yourScore")) || 0)
    const [bestScore, setBestScore] = useState(JSON.parse(localStorage.getItem("bestScore")) || 0)
    const [yourTime, setYourTime] = useState(0)
    const [bestTime, setBestTime] = useState(JSON.parse(localStorage.getItem("bestTime")) || 0)
    const [startTime, setStartTime] = useState(JSON.parse(localStorage.getItem("startTime")) || getTime())
    const refIntervalID = useRef(0);

   
    
    localStorage.clear();

    console.log(refIntervalID.current)

    useEffect(function(){
        if(yourScore < bestScore && bestScore > 0 && tenzies){
            setBestScore(yourScore)
        } else if(bestScore === 0 && tenzies){
            setBestScore(yourScore)
        }  

        if(yourTime < bestTime && bestTime > 0 && tenzies){
            setBestTime(yourTime)
            clearInterval(refIntervalID.current)
        } else if(bestTime === 0 && tenzies){
            setBestTime(yourTime)
            clearInterval(refIntervalID.current)
        }
        //localStorage.clear()
        //console.log("fuck you 1")
    },[tenzies])

    useEffect(function(){
        let count = true;
        let die = 0 ;
        
        
        dieData.forEach(function(item){
            if(die === 0){
                die = item.value
                if(item.isHeld===false){
                    count =false
                }
            }else {
                if(die !== item.value || item.isHeld===false){
                    count =false
                }
            }
        })
        localStorage.setItem("dataDieSave", JSON.stringify(dieData))
        //localStorage.clear()
        console.log("fuck you 2")
        if(count === true){
            setTenzies(true)
            console.log("YOUPI")
        }      

    },[dieData])

    useEffect(function(){
        localStorage.setItem("yourScore", JSON.stringify(yourScore))
    }, [yourScore])

    useEffect(function(){
        localStorage.setItem("bestScore", JSON.stringify(bestScore)) 
    }, [bestScore])

    useEffect(function(){
        console.log("TEST")
        if(!tenzies){
            console.log("Valeur de Tenzie "+tenzies)
            console.log(refIntervalID.current)
            clearInterval(refIntervalID.current)
            refIntervalID.current = setInterval(function(){
                const d = new Date();
                setYourTime(Math.ceil((d.getTime() - startTime)/1000))  
            }, 1000);
            /*setIntervalIDs(prevIntervalIds => {
                prevIntervalIds.push(id)
                return prevIntervalIds
            })//*/
            localStorage.setItem("yourTime", JSON.stringify(yourTime))
        }else{
            clearInterval(refIntervalID.current)
        }
    }, [yourTime])

    useEffect(function(){
        localStorage.setItem("bestTime", JSON.stringify(bestTime)) 
    }, [bestTime])

    
    function allNewDice(){
        let allNewDice = []
        for(let i=0; i <10; i++ ){
            allNewDice.push({id:i+1, value: Math.ceil(Math.random() * 10), isHeld:false})
        }
        return allNewDice;
    }

    

    function roll(){
        if(!tenzies){
            setDieData(prevDieData =>
                prevDieData.map(function(die){
                    return die.isHeld === false ? 
                    {...die, value: Math.ceil(Math.random() * 10)} :
                    die
                }
            ))
            setYourScore(prevYourSocre => prevYourSocre + 1)
        }else{
            setTenzies(false)
            setDieData( allNewDice())   
            setYourScore(0)
            setYourTime(0)
            setStartTime(getTime())
        }
        
    }

    function holdDice(id){
        setDieData(function(prevDieData){
            let newDieData = []
            prevDieData.forEach(function(item){
                if(item.id===id){
                    newDieData.push({...item, isHeld: !item.isHeld})
                }else{
                    newDieData.push(item)
                }
            })
            
            return newDieData
        })
        
    }

    
    
    
    function getTime(){
        const d = new Date();
        return d.getTime();
    }

    localStorage.clear();

    return (
        <main>
            {tenzies && <Confetti  width={400} height={400} />}
            <div className="details">
                <div className="details-score">
                    <div className="best">Best score : {bestScore}</div>
                    <div className="yours">Your score : {yourScore}</div>
                </div>
                <div className="details-time">
                    <div className="best">Best time : {bestTime}</div>
                    <div className="yours">Your score : {yourTime}</div>
                </div>
            </div>
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="die-container">
                {dieData.map(function(item){
                    return <DieCell key={item.id} id={item.id} value={item.value} isHeld={item.isHeld} onHandle={holdDice}/>
                })}
            </div>
            <button className="die-button" onClick={roll}>{tenzies?"Reset the game":"Roll"}</button>
        </main>
    )
}