import React, { Component } from 'react';
import './app.scss';
import axios from 'axios';
import LeftBox from './LeftBox/ElementList';
import MidBox from './MidBox/Pie';
import RightBox from './RightBox/RightBox';


class App extends Component {
  constructor() {
    super();
    this.state = {
      mode: 'Standup',
      allList: [],
      pieList: [],
      deleted: [],
      added: [],
      standupList: [],
      retroList: [],
      sprintPlanList: [],
      colorsList: []
    }

  }

  componentDidUpdate(prevProps) {
    if (prevProps.pieList !== this.props.pieList || prevProps.allList !== this.props.allList) {
      this.getAllList();
      this.getColorList();
      this.getStandupList();
      this.getRetroList();
      this.getSprintPlanList();
    }
  }

  getAllList = () => {
    axios.get('https://us-central1-wheel-of-fortune-b4c69.cloudfunctions.net/api/all')
      .then(res => {
        const allList = res.data;
        this.setState({ allList });
      });
  }

  getColorList = () => {
    axios.get('https://us-central1-wheel-of-fortune-b4c69.cloudfunctions.net/api/colors')
      .then(res => {
        const colorsList = res.data;
        this.setState({ colorsList })
      })
  }

  getStandupList = () => {
    axios.get('https://us-central1-wheel-of-fortune-b4c69.cloudfunctions.net/api/standup')
      .then(res => {
        const standupList = res.data;

        this.setState({
          standupList,
          pieList: standupList,
        });
      })
  }

  getRetroList = () => {
    axios.get('https://us-central1-wheel-of-fortune-b4c69.cloudfunctions.net/api/retro')
      .then(res => {
        const retroList = res.data;
        this.setState({ retroList })
      })
  }

  getSprintPlanList() {
    axios.get('https://us-central1-wheel-of-fortune-b4c69.cloudfunctions.net/api/sprint-plan')
      .then(res => {
        const sprintPlanList = res.data;
        this.setState({ sprintPlanList })
      })
  }

  componentDidMount() {
    this.getAllList();
    this.getColorList();
    this.getStandupList();
    this.getRetroList();
    this.getSprintPlanList();
  }

  determinePieList = (mode) => {
    this.setState({ mode })
    switch (mode) {
      case 'standup':
        this.setState({
          pieList: [...this.state.standupList],
          removed: [],
          added: []
        });
        break;
      case 'retro':
        this.setState({
          pieList: [...this.state.retroList],
          removed: [],
          added: []
        });
        break;
      case 'sprint-planning':
        this.setState({
          pieList: [...this.state.sprintPlanList],
          removed: [],
          added: []
        });
        break;
      default:
        console.log('cannot get mode for determine')
    }
  }


  reSetElementList = (name, mode) => {

    const pieList = [...this.state.pieList];
    let updatedPieList;

    const canToDelete = pieList.find(ele => ele.name === name)
    if (canToDelete) {
      if (pieList.length >= 4) {
        updatedPieList = pieList.filter(element => {
          return element.name !== name
        });
        this.state.deleted.push(canToDelete);
      } else {
        updatedPieList = pieList
      }
    } else {
      let newCan = this.state.allList.find(ele => ele.name === name);
      this.state.added.push(newCan);
      newCan.mode = mode;
      updatedPieList = [...pieList, newCan]
    }
    this.setState({
      pieList: updatedPieList
    })
  }


  deleteCan = (eleInAll, eleInPie) => {
    console.log('here is the ele in pie', eleInPie);
    if (eleInAll) {
      const updatedAllList = this.state.allList.filter(e => e.id !== eleInAll.id);
      this.setState({ allList: updatedAllList })
      axios.delete(`https://us-central1-wheel-of-fortune-b4c69.cloudfunctions.net/api/sirius-all/${eleInAll.id}`)
    }
    if (eleInPie) {
      const updatedPieList = this.state.pieList.filter(e => e.id !== eleInPie.id);
      this.setState({ pieList: updatedPieList })
      //TODO: find the id in different list by name
      let standupID, retroID, sprintplanID;

      switch (eleInPie.mode) {
        case "standup":
          standupID = eleInPie.id;
          retroID = this.state.retroList.filter(e => e.name === eleInPie.name).id;
          sprintplanID = this.state.sprintPlanList.filter(e => e.name === eleInPie.name).id;
          break;
        case "retro":
          standupID = this.state.standupList.filter(e => e.name === eleInPie.name).id;
          retroID = eleInPie.id;
          sprintplanID = this.state.sprintPlanList.filter(e => e.name === eleInPie.name).id;
          break;
        case "plan":
          standupID = this.state.standupList.filter(e => e.name === eleInPie.name).id;
          retroID = this.state.retroList.filter(e => e.name === eleInPie.name).id;
          sprintplanID = eleInPie.id;
          break;
        default:
          console.log("didn't find the mode to remove this element from display list")
      }
      console.log(standupID, retroID, sprintplanID)
      axios.delete(`https://us-central1-wheel-of-fortune-b4c69.cloudfunctions.net/api/sirius-standup/${standupID}`);
      axios.delete(`https://us-central1-wheel-of-fortune-b4c69.cloudfunctions.net/api/sirius-retro/${retroID}`);
      axios.delete(`https://us-central1-wheel-of-fortune-b4c69.cloudfunctions.net/api/sirius-sprintplan/${sprintplanID}`);

    }
    // if(eleRetro){
    //   const updatedPieList = this.state.pieList.filter(e => e.id !== eleInPie.id);
    //   this.setState({ pieList: updatedPieList })
    //   axios.delete(`https://us-central1-wheel-of-fortune-b4c69.cloudfunctions.net/api/sirius-retro/${eleInPie.id}`)
    // }
    // if(eleSprintplan){
    //   const updatedPieList = this.state.pieList.filter(e => e.id !== eleInPie.id);
    //   this.setState({ pieList: updatedPieList })
    //   axios.delete(`https://us-central1-wheel-of-fortune-b4c69.cloudfunctions.net/api/sirius-sprintplan/${eleInPie.id}`)
    // }
  }

  addCan = (newCan) => {
    const updatedAllList = [...this.state.allList, newCan]
    this.setState({
      allList: updatedAllList
    })
  }

  shuffleWheel = () => {
    let updatedList = [...this.state.pieList];
    this.setState({
      pieList: updatedList.sort(() => Math.random() - 0.5)
    })
  }

  render() {
    return (
      <div className="app">
        <LeftBox
          mode={this.state.mode}
          allList={this.state.allList}
          pieList={this.state.pieList}
          reSetElementList={this.reSetElementList}
          deleteCan={this.deleteCan}
          addCan={this.addCan}
        />
        <MidBox
          pieList={this.state.pieList}
          colorsList={this.state.colorsList}
          added={this.state.added}
          deleted={this.state.deleted}
          resetCan={this.resetCan}
          mode={this.state.mode}
          shuffleWheel={this.shuffleWheel}
        />
        <RightBox determinePieList={this.determinePieList} />
      </div>


    );
  }

}

export default App;
