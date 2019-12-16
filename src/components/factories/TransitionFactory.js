import TC from '../controllers/TransitionControls.svelte';
import { 
  submitScript, 
  LayoutDataFunctions, 
  changeLayout, 
  getNumSockets 
} from '../../routes/controls/messages';
import { layouts } from '../../routes/controls/controlStores';


export default (jsPanel) => {
  jsPanel.create({
    headerTitle: 'Transition',
    borderRadius: '2px',
    theme: 'dark',
    position: 'center-top 0 58',
    contentSize: '250 250',
    setStatus: 'minimized',
    headerControls: {
      close: 'remove',
    },
    callback() {
      new TC({
        target: this.content,
        props: {
          submitScript,
          layouts,
          LayoutDataFunctions,
          changeLayout,
          getNumSockets
        }
      })
    }
  })
}