import {
  isStringOrNumber,
  updateHostComponent,
  isArray,
  isfn,
  updateFunctionComponent,
} from "./ReactFiberReconciler";
import { Placement } from "./const";
let wipRoot = null;
let wip = null; // work in progress

export function scheduleUpdateOnFiber(fiber) {
  wipRoot = fiber;
  wip = fiber;
}

function workLoop(IdleDeepline) {
  while (wip && IdleDeepline.timeRemaining() > 0) {
    performUnitWork();
  }
  if (!wip && wipRoot) {
    commitRoot();
  }
}
function commitRoot() {
  commitWorker(wipRoot);
  wipRoot = null;
}
function commitWorker(wip) {
  if (!wip) {
    return;
  }
  // self
  const { flags, stateNode } = wip;
  // 父dom节点
  let parentNode = getParentNode(wip.return); //wip.return.stateNode;
  if (flags && Placement && stateNode) {
    parentNode.appendChild(stateNode);
  }
  // child
  commitWorker(wip.child);

  // sibling
  commitWorker(wip.sibling);
}

function performUnitWork() {
  //处理当前任务
  const { type } = wip;
  console.log(type);
  if (isStringOrNumber(type)) {
    updateHostComponent(wip);
  } else if (isfn(type)) {
    updateFunctionComponent(wip);
  }
  //处理下一个任务
  // 优先深度遍历
  if (wip.child) {
    wip = wip.child;
    return;
  }
  let next = wip;
  while (next) {
    if (next.sibling) {
      wip = next.sibling;
      return;
    }
    next = next.return;
  }
  wip = null;
}
function getParentNode(wip) {
  let tem = wip;
  while (tem) {
    if (tem.stateNode) {
      return tem.stateNode;
    }
    tem = tem.return;
  }
}
requestIdleCallback(workLoop);
