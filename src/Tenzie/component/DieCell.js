export default function DieCell(props){
    const styles = {
        backgroundColor: props.isHeld? "#59E391":"#FFFFFF",
    }
    return(
        <div style={styles} className="die-face" onClick={function(){props.onHandle(props.id)}}><h2 className="die-num" >{props.value}</h2></div>
    )
}