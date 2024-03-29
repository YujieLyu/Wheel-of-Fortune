import React, { Component } from 'react';
import axios from 'axios';
import './pie.scss';
import Slice from '../components/Slice/Slice';
import CustomButton from '../components/CustomButton/customButton';

class Pie extends Component {
    constructor() {
        super();
        this.state = {
            degree: null
        }
    }

    createPie() {
        let pieList = [...this.props.pieList]
        let colorsList = [...this.props.colorsList]
        let sliceAngle, skewValue;
        sliceAngle = 360 / pieList.length;
        skewValue = sliceAngle + 90;

        return pieList.length > 0 && colorsList.length > 0 ? (
            pieList.map((ele, i) =>
                (
                    <Slice key={i}
                        sliceAngle={sliceAngle}
                        index={i}
                        skewValue={skewValue}
                        pieListEle={ele}
                        colorListEle={colorsList[i]} />
                )
            )) : (<div>
                Loading...
            </div>);
    }

    alertHost = (deg) => {
        let dist = 360 - (deg % 360);
        let host = Math.floor(dist * this.props.pieList.length / 360);
        let hostName = this.props.pieList[host].name;
        const newHost = {
            name: hostName
        }
       console.log(this.props.mode)
        switch (this.props.mode.toLowerCase()) {
            case "standup":
                axios.post('https://us-central1-wheel-of-fortune-b4c69.cloudfunctions.net/api/add-standup-host', newHost)
                    .then(res => {
                        console.log(res);
                        console.log(res.data)
                    });
                setTimeout(() => this.props.deleted.forEach(e =>
                    axios.delete(`https://us-central1-wheel-of-fortune-b4c69.cloudfunctions.net/api/sirius-standup/${e.id}`)
                ), 6000)

                break;
            case "retro":
                axios.post('https://us-central1-wheel-of-fortune-b4c69.cloudfunctions.net/api/add-retro-host', newHost)
                    .then(res => {
                        console.log(res);
                        console.log(res.data)
                    });
                break;
            case "plan":
                axios.post('https://us-central1-wheel-of-fortune-b4c69.cloudfunctions.net/api/add-plan-host', newHost)
                    .then(res => {
                        console.log(res);
                        console.log(res.data)
                    });
                break;
            default:
                console.log('failed to catch mode after alert host')
        }

        alert(`Congrats, ${hostName} ! You will run the next stand-up`)
    }

    handleClick = () => {
        let x = 1024;
        let y = 60204;
        let deg = Math.floor(Math.random() * (x - y)) + y;
        this.setState({
            degree: deg
        })
        setTimeout(() => this.alertHost(deg), 5500);


        this.props.added.forEach(e =>
            axios.post('https://us-central1-wheel-of-fortune-b4c69.cloudfunctions.net/api/newStandupCan', e)
        )


        // switch (pieList[0].mode) {
        //     case "standup":
        //         originPieList.forEach(ele =>
        //             axios.delete('https://us-central1-wheel-of-fortune-b4c69.cloudfunctions.net/api/delete-standup',
        //                 { data: ele })
        //                 .then((res) => console.log(res))
        //                 .catch(err => console.log(err))
        //         );
        //         pieList.forEach(ele => axios.post('https://us-central1-wheel-of-fortune-b4c69.cloudfunctions.net/api/update-can', ele)
        //             .catch(err => console.log(err))
        //         )
        //         break;
        //     case "retro":
        //         originPieList.forEach(ele =>
        //             // console.log(ele)
        //             axios.delete('https://us-central1-wheel-of-fortune-b4c69.cloudfunctions.net/api/delete-retro', { data: ele })
        //                 .then((res) => console.log(res))
        //                 .catch(err => console.log(err))
        //         );
        //         pieList.forEach(ele => axios.post('https://us-central1-wheel-of-fortune-b4c69.cloudfunctions.net/api/update-can', ele))
        //         break;
        //     case "plan":
        //         originPieList.forEach(ele =>
        //             // console.log(ele)
        //             axios.delete('https://us-central1-wheel-of-fortune-b4c69.cloudfunctions.net/api/delete-sprintplan', { data: ele })
        //                 .then((res) => console.log(res))
        //                 .catch(err => console.log(err))
        //         );
        //         pieList.forEach(ele => axios.post('https://us-central1-wheel-of-fortune-b4c69.cloudfunctions.net/api/update-can', ele))
        //         break;
        //     default:
        //         console.log('cannot get the mode for pie');
        // }


        // if (pieList >= 4) {
        //     console.log(this.props.pieList);
        //     pieList.map(ele => axios.post('https://us-central1-wheel-of-fortune-b4c69.cloudfunctions.net/api/update-can', ele))
        // } else {
        //     this.props.resetCan();
        // }
        // console.log(this.props.pieList);
        // console.log(this.props.originPieList);
    }

    render() {
        return (
            <div className="MidBox" >
                <ul
                    className="pie"
                    id="pie"
                    style={{ transform: 'rotate(' + this.state.degree + 'deg)' }}>
                    {this.createPie()}
                </ul>
                <button className="spin" onClick={this.handleClick}>GO</button>

                <CustomButton
                    value="shuffleBtn"
                    name="Shuffle the wheel"
                    handleClick={this.props.shuffleWheel}
                />
            </div>
        )
    }
}


export default Pie;