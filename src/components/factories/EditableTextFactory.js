import ETC from '../controllers/EditableTextControls.svelte';
import { editableTexts } from '../../routes/controls/controlStores';
import { submitScript } from '../../routes/controls/messages';


export default (jsPanel) => {
  jsPanel.create({
    headerTitle: 'Text Editor',
    borderRadius: '2px',
    theme: 'dark',
    position: 'center-top 0 58',
    contentSize: '250 250',
    setStatus: 'minimized',
    headerControls: {
      close: 'remove',
    },
    callback() {
      new ETC({
        target: this.content,
        props: {
          submitScript,
          elementList: editableTexts
        }
      })
    }
  })
}