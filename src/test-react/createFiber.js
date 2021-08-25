import { Placement } from "./const";

export default function createFiber(vnode, returnFiber) {
  const newFiber = {
    type: vnode.type,
    key: vnode.key,
    props: vnode.props,
    // 第一个子fiber
    child: null,
    //下一个兄弟fiber
    sibling: null,
    // 父fiber
    return: returnFiber,
    // 标记当前fiber提交的是什么类型的操作
    flags: Placement,
    //如果是原声标签：dom节点
    //类组件：类实例
    stateNode: null,
  };
  return newFiber;
}
