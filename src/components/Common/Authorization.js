const nodeList = JSON.parse(localStorage.getItem('nodeList'));


export const authorization = (id) => {
    // console.log('NodeList', nodeList)
    const match = nodeList?.some(item => item.nodeID === id);
    if (match === false) {
        window.location.replace('/unauthorized');
    }
}