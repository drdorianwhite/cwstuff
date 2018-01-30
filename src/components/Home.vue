
<template>
  <q-layout
    ref="layout"
    view="lHh Lpr fff"
    :left-class="{'bg-grey-2': true}"
  >   
  <q-modal ref="registerModal" minimize>
      <h4>Register as New User</h4>
       <q-btn color="primary" @click="$refs.registerModal.close()">Close</q-btn>
  </q-modal>

  <cheader></cheader>
   <q-fixed-position corner="top-right" :offset="[18, 18]">
     <div class="stickybar">
        <div class="refreshratebutton stickybutton stickyitem"><q-icon name="alarm" />Price Refresh Rate</div>
        <div class="colorsetting stickybutton stickyitem"><q-icon name="color_lens" />Site Colors</div>
         <q-select class="stickyitem stickyselect" v-model="selectCurrency" :options="selectCurrencyOptions" />
         <q-select class="stickyitem stickyselect" v-model="selectLanguage" :options="selectLanguageOptions" />
        <q-btn class="save" @click="alert">Save</q-btn>
     </div>
  </q-fixed-position>

  <div class="chartview">
  
    <div class="sortbar">
      <q-list class="sortlist">
        <q-collapsible opened class="columnhead sortby" icon="none" label="Sort By">
          <div class="sortcontainer">
            <q-tabs class="sortoptions">
              <q-tab class="chartsort" v-model="chartsort" label="price"/>
              <q-tab class="chartsort"  v-model="chartsort" label="24 hour change"/>
              <q-tab class="chartsort"  v-model="chartsort" label="7 day change"/>
              <q-tab class="chartsort"  v-model="chartsort" label="24 hour volume"/>
              <q-tab class="chartsort"  v-model="chartsort" label="Coin supply"/>
              <q-tab class="chartsort"  v-model="chartsort" label="Market cap"/>
              <q-tab class="chartsort"  v-model="chartsort" label="Circulating Supply"/>
            </q-tabs>
          </div>
        </q-collapsible>
        <q-collapsible class="columnhead" icon="fa-filter" label="Advanced Search">
          <div> 
          </div>
        </q-collapsible>
      </q-list>
    </div>
    <div class="tablecontent">

      <table class="table">
        <colgroup>
        <col width="5%">
        <col width="5%">
        <col width="10%">
        <col width="10%">  
        </colgroup>      
        <tr>
          <th>More Info</th>
          <th>Options</th>
          <th>#</th>
          <th>COIN</th>
          <th>FAVORITE</th>
          <th>PRICE</th>
          <th>24HR<br>CHANGE</th>
          <th>7DAY<br>CHANGE</th>
          <th>24HR<br>VOLUME</th>
          <th>MARKET CAP</th>
          <th>24HR<br>HIGH</th>
          <th>24HR<br>LOW</th>
        </tr>
        <tbody v-for="row in tableData">
            <tr><td></td><td></td><td></td><td>{{row.coin}}</td><td>{{row.price}}</td><td>{{row.coin}}</td><td>{{row.coin}}</td><td>{{row.coin}}</td><td>{{row.coin}}</td><td>{{row.coin}}</td></tr>
            <tr class="chartrow"><td colspan="12"><div class="chartsection"><coinchart></coinchart>
            </div></td></tr>
        </tbody>
        
      </table>
    
    </div>

  </div>
  </q-layout>
</template>

<script>
import {
  QSearch,
  dom,
  event,
  openURL,
  QLayout,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain,
  QTabs,
  QTab,
  QRouteTab,
  QRadio,
  QItemTile,
  QCollapsible,
  QModal,
  QSelect
} from 'quasar'

import 'quasar-extras/fontawesome'

import Cheader from './Cheader'
import Coinchart from './Coinchart'
/*
$(document).ready(function(){
  var changeActive = function() {
    $('.q-option-inner').parent().parent().removeClass('active');
    $('.q-option-inner.active').parent().parent().addClass('active');
  }
  $('.q-list').on('click', function() {
    setTimeout(changeActive, 00);
  });
});
*/

const
  { viewport } = dom,
  { position } = event,
  moveForce = 30,
  rotateForce = 40,
  RAD_TO_DEG = 180 / Math.PI

function getRotationFromAccel (accelX, accelY, accelZ) {
  /* Reference: http://stackoverflow.com/questions/3755059/3d-accelerometer-calculate-the-orientation#answer-30195572 */
  const sign = accelZ > 0 ? 1 : -1
  const miu = 0.001

  return {
    roll: Math.atan2(accelY, sign * Math.sqrt(Math.pow(accelZ, 2) + miu * Math.pow(accelX, 2))) * RAD_TO_DEG,
    pitch: -Math.atan2(accelX, Math.sqrt(Math.pow(accelY, 2) + Math.pow(accelZ, 2))) * RAD_TO_DEG
  }
}

export default {
  name: 'index',
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
    QTabs,
    QTab,
    QSearch,
    QRouteTab,
    Cheader,
    QRadio,
    QCollapsible,
    QModal,
    QSelect,
    Coinchart
  },
  data () {
    return {
      orienting: window.DeviceOrientationEvent && !this.$q.platform.is.desktop,
      rotating: window.DeviceMotionEvent && !this.$q.platform.is.desktop,
      moveX: 0,
      moveY: 0,
      rotateY: 0,
      rotateX: 0,
      option: ['opt1'],
      selectCurrencyOptions: [
        {
          label: 'USD',
          value: 'usd'
        },
        {
          label: 'Euro',
          value: 'euro'
        }
      ],
      selectLanguageOptions: [
        {
          label: 'English',
          value: 'english'
        },
        {
          label: 'German',
          value: 'german'
        }
      ],
      tableData: [
        {coin: 'Bitcoin', price: '15000.00', d24hrchange: '1000', d7daychange: '1500', marketcap: '100000', d24hrhigh: '16000', d24hrlow: '14000'},
        {coin: 'Bitcoin', price: '15000.00', d24hrchange: '1000', d7daychange: '1500', marketcap: '100000', d24hrhigh: '16000', d24hrlow: '14000'},
        {coin: 'Bitcoin', price: '15000.00', d24hrchange: '1000', d7daychange: '1500', marketcap: '100000', d24hrhigh: '16000', d24hrlow: '14000'},
        {coin: 'Bitcoin', price: '15000.00', d24hrchange: '1000', d7daychange: '1500', marketcap: '100000', d24hrhigh: '16000', d24hrlow: '14000'},
        {coin: 'Bitcoin', price: '15000.00', d24hrchange: '1000', d7daychange: '1500', marketcap: '100000', d24hrhigh: '16000', d24hrlow: '14000'},
        {coin: 'Bitcoin', price: '15000.00', d24hrchange: '1000', d7daychange: '1500', marketcap: '100000', d24hrhigh: '16000', d24hrlow: '14000'},
        {coin: 'Bitcoin', price: '15000.00', d24hrchange: '1000', d7daychange: '1500', marketcap: '100000', d24hrhigh: '16000', d24hrlow: '14000'},
        {coin: 'Bitcoin', price: '15000.00', d24hrchange: '1000', d7daychange: '1500', marketcap: '100000', d24hrhigh: '16000', d24hrlow: '14000'},
        {coin: 'Bitcoin', price: '15000.00', d24hrchange: '1000', d7daychange: '1500', marketcap: '100000', d24hrhigh: '16000', d24hrlow: '14000'},
        {coin: 'Bitcoin', price: '15000.00', d24hrchange: '1000', d7daychange: '1500', marketcap: '100000', d24hrhigh: '16000', d24hrlow: '14000'},
        {coin: 'Bitcoin', price: '15000.00', d24hrchange: '1000', d7daychange: '1500', marketcap: '100000', d24hrhigh: '16000', d24hrlow: '14000'}
      ]
    }
  },
  computed: {
    position () {
      const transform = `rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg)`
      return {
        top: this.moveY + 'px',
        left: this.moveX + 'px',
        '-webkit-transform': transform,
        '-ms-transform': transform,
        transform
      }
    }
  },
  methods: {
    launch (url) {
      openURL(url)
    },
    move (evt) {
      const
        {width, height} = viewport(),
        {top, left} = position(evt),
        halfH = height / 2,
        halfW = width / 2

      this.moveX = (left - halfW) / halfW * -moveForce
      this.moveY = (top - halfH) / halfH * -moveForce
      this.rotateY = (left / width * rotateForce * 2) - rotateForce
      this.rotateX = -((top / height * rotateForce * 2) - rotateForce)
    },
    rotate (evt) {
      if (evt.rotationRate &&
          evt.rotationRate.beta !== null &&
          evt.rotationRate.gamma !== null) {
        this.rotateX = evt.rotationRate.beta * 0.7
        this.rotateY = evt.rotationRate.gamma * -0.7
      }
      else {
        /* evt.acceleration may be null in some cases, so we'll fall back
           to evt.accelerationIncludingGravity */
        const
          accelX = evt.acceleration.x || evt.accelerationIncludingGravity.x,
          accelY = evt.acceleration.y || evt.accelerationIncludingGravity.y,
          accelZ = evt.acceleration.z || evt.accelerationIncludingGravity.z - 9.81,
          rotation = getRotationFromAccel(accelX, accelY, accelZ)

        this.rotateX = rotation.roll * 0.7
        this.rotateY = rotation.pitch * -0.7
      }
    },
    orient (evt) {
      if (evt.beta === null || evt.gamma === null) {
        window.removeEventListener('deviceorientation', this.orient, false)
        this.orienting = false

        window.addEventListener('devicemotion', this.rotate, false)
      }
      else {
        this.rotateX = evt.beta * 0.7
        this.rotateY = evt.gamma * -0.7
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.orienting) {
        window.addEventListener('deviceorientation', this.orient, false)
      }
      else if (this.rotating) {
        window.addEventListener('devicemove', this.rotate, false)
      }
      else {
        document.addEventListener('mousemove', this.move)
      }
    })
  },
  beforeDestroy () {
    if (this.orienting) {
      window.removeEventListener('deviceorientation', this.orient, false)
    }
    else if (this.rotating) {
      window.removeEventListener('devicemove', this.rotate, false)
    }
    else {
      document.removeEventListener('mousemove', this.move)
    }
  }
}
</script>

<style lang="stylus">
.chartsection
  height 100px
.stickybar
  height: 100px
  width: 100%
  background-color #333333
  margin 5px
  padding 5px
.stickyitem
  float left 
.stickyselect
  width 100px
.stickybutton
  padding 35px
  float left
  height 100%
  border-right-color white
  border-right-style solid
  color white
.save 
  background-color cyan
  float right
  margin-right 200px
  width 80px
  height 30px
.tablecontent
  float left
  margin-left 50px
.table
  text-align center;
  color white
  width 800px
.table > tr > th
  background-color #aaaaaa
.columnhead
  background-color #aaaaaa
  font-size .9rem 
  color black
.q-tabs-head 
  min-height 0
.sortby .q-item .q-item-side-left
  width 0
.sortlist
  padding 0
.q-item-label
  text-align center
.table > tr > td
  background-color #333333
  padding: 5px
.chartsort
  font-size .8rem
.chartsort.active
  background-color cyan
input:checked 
  background-color white
.sortbar
  color white
  margin-left: 20px
  float left 
  margin-top 0
  min-width 10%
  max-width 20%
.sortcontainer
  padding 0
.q-collapsible-sub-item
  padding 0
.q-item-side
  min-width 0
.sortoptions
    background-color  #333333
    text-align left
    padding 0
.chartview
  margin-top 5px
  height 500px
  padding-top 30px
  background-color black
</style>
