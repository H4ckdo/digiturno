//@ sourceMappingUR=/assets/js/tv.bundle.js.map
import React from 'react';
import $ from 'jquery';
import '../../scss/components/TV.scss';
import './../../../assets/js/dependencies/slick/slick.js';
import PopUp from './PopUp';
import { copyCollection } from '../utils';
//import '../../../assets/js/dependencies/slick/slick.js';
//const { SADDRESS } = require('../../../config/env/address.json');

/**
* Represent TV componnent class
* @constructor
* @param {Object} props - properties inherited of React.Component
*/
export default class TV extends React.Component {
  constructor(props) {
    super(props);
    this.childrens = {};
    this.state = {
      tokens: [],
      config: {
        slidesToShow: 3,
        autoplay: true,
        autoplaySpeed: 1000,
        slidesToScroll: -1
      }
    }
  }

  generateTemplate(data = []) {
    let result = data.map((element) => {
      return `
        <li>
          <i class="material-icons">notifications_active</i>
          <span class='token-name'>${ element.name }</span>
        </li>
      `
    })
    return result;
  }

  /*
  componentDidMount() {
    let self = this;
    const SADDRESS = window.localStorage.getItem('SADDRESS');
    const sound = new Audio(`./../../../assets/audio/call.mp3`);

    io.sails.url = `http://${SADDRESS}:1337`;
    let client = io.sails.connect();

    client.get(`http://${SADDRESS}:1337/tv/join`, (response, jwRes) => {
      this.setState({ tokens: response.data });
      $(".regular").html(this.generateTemplate(this.state.tokens)).slick(this.state.config);
    })

    client.on('newToken', (newToken) => {
      let clonetokens = copyCollection(this.state.tokens);
      clonetokens.push(newToken.data[0]);
      this.setState({ tokens: clonetokens});
      $(".regular").slick('slickAdd', `
        <li>
          <i class="material-icons">notifications_active</i>
          <span class='token-name'>${ newToken.data[0].name }</span>
        </li>
      `)
      sound.play();
    })


    client.on('pullToken', (oldToken) => {
      console.log('oldToken', oldToken);
      if(oldToken.data.length === 0) return;
      let tokenIndex = this.state.tokens.findIndex((token) => token.id === oldToken.data[0].id);
      if(tokenIndex > -1 ) {
        let tokensCopy = copyCollection(this.state.tokens);
        tokensCopy.splice(tokenIndex, 1);
        this.setState({ tokens: tokensCopy });
        $(".regular").slick('slickRemove', tokenIndex);
      }
    })

  }
  */

  render() {
    return (
      <div>
        <PopUp
          id="testPopUp"
          animation={"rebound"}
          type="load"
        />
      </div>
    )
  }//end render
}
