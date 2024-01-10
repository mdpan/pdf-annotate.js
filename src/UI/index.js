import { addEventListener, removeEventListener, fireEvent } from './event';
import { disableEdit, enableEdit } from './edit';
import { disablePen, enablePen, setPen } from './pen';
import { disablePoint, enablePoint, setPoint } from './point';
import { disableRect, enableRect } from './rect';
import { disableText, enableText, setText } from './text';
import { createPage, renderPage } from './page';
import { disableSignature, enableSignature } from './signature';
import { disableSignimg, enableSignimg } from './signimg';

export default {
  addEventListener, removeEventListener, fireEvent,
  disableEdit, enableEdit,
  disablePen, enablePen, setPen,
  disablePoint, enablePoint, setPoint,
  disableRect, enableRect,
  disableText, enableText, setText,
  disableSignature, enableSignature,
  disableSignimg, enableSignimg,
  createPage, renderPage  
};
