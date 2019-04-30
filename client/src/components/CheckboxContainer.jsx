import React from 'react';
import PropTypes from 'prop-types';
// FIXME: gdzie jest plik checkboxes
import checkboxes from './checkboxes';
import Checkbox from './Checkbox';

class CheckboxContainer extends React.Component {
  // FIXME: construktor jest nie potrzebny urzywaj go tylko jeśli masz głębszą logikę do wykonania
  //        w momęcie kiedy byś miał handleChange jako arraw function  wystaczyło by zainijsalizować state jako pole w klasie
  constructor(props) {
    super(props);

    // FIXME: checkedItems jest zupełnie nie potrzebny w tym przypadku wystaczy zainicjalizować posty obiekt state
    //   this.state = {};

    this.state = {
      checkedItems: new Map(),
    }

    this.handleChange = this.handleChange.bind(this);
  }
  // FIXME: zastosuj arrow function nie bdziesz musiał bindować tej funkcji
  handleChange(e) {

    // FIXME: do wyciągania posczegulnych pul z obiektu urzywaj destrukturyzacji
    // tutaj wystarczyło zrobic 

    // const {name, checked} = e.targe;

    // a w tym przypadku potrzebny ci jest tylko name restę będzie się działo w set stacie

    const item = e.target.name;
    const isChecked = e.target.checked;
    // FIXME: w zwiażku z tym że nie jest potrzebna Mapa wystarczy taki kod
    //  this.setState(prevState => ({ [name]: !prevState[name]}))
    this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
  }

  render() {
    return (
      <React.Fragment>
        {
          // FIXME: destrukt `name` nie będziesz musiał poważać ciągle item, czy Item napewno zawiera pole key za klucz bym urzył na pola name ponieważ i tak musi być atomowe
          checkboxes.map(item => (
            <label key={item.key}>
              {item.name}
              {/* FIXME: jak zastosujes poprzednie uwagi to tu wystarczy tyle 'checked={this.state[item.name]}'  */}
              <Checkbox name={item.name} checked={this.state.checkedItems.get(item.name)} onChange={this.handleChange} />
            </label>
          ))
        }
      </React.Fragment>
    );
  }
}

export default CheckboxContainer;