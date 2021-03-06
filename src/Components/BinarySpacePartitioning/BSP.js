import Leaf from "./leaf.js";

function splitRoot(root, tree) {
    //level order tree traversal
    let q = [];
    q.push(root);
    while (q.length !== 0) {
        tree.push(q[0]);

        if (q[0].split()) {
            q.push(q[0].getLeftChild());
            q.push(q[0].getRightChild());
            // tree.push(q[0].getLeftChild());
            // tree.push(q[0].getRightChild());
        } else {
            q[0].createRoom();
        }
        q.shift();
    }

    //run createConnector() from root
    tree[0].createConnector();

    return tree;
}

function BSP(x, y, width, height, settingOptions) {
    var tree = [];
    var root = new Leaf(x, y, width, height, settingOptions);

    tree = splitRoot(root, tree);

    return tree;

    //only get leaves (last node)
    /*
    var leaves = [];

    tree.forEach((l) => {
        if (l.getRightChild());
        else leaves.push(l);
    });

    return leaves;
    */
}

export default BSP;
