import createFiber from "./createFiber";
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";
// container即dom节点
function createRoot(container) {
  const root = {
    containerInfo: container,
  };
  return new ReactDOMRoot(root);
}

function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot;
}

ReactDOMRoot.prototype.render = function (children) {
  const root = this._internalRoot;
  updateContainer(children, root);
};

function updateContainer(element, root) {
  console.log(element);
  const { containerInfo } = root;
  const fiber = createFiber(element, {
    type: containerInfo.nodeName.toLocaleLowerCase(),
    stateNode: containerInfo,
  });
  // 更新fiber节点
  scheduleUpdateOnFiber(fiber);
}
export default { createRoot };
