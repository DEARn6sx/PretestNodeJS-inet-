console.log("Hello World");

function maxmin(x , y) {
    console.log(`X =  %d Y = %d`,x,y);
    if (x > y) {
        
        console.log(` X is max number`);
        console.log(` Y is min number`);
     }
     else if (x < y){
        console.log(` Y is max number`);
        console.log(` X is min number`);
    }
    else {
        console.log("Both numbers are equal.");
    }
    console.log();
}

module.exports = maxmin



// maxmin(10,20)
// maxmin(20,10)
// maxmin(20,20)


function Mathmaxmin(x, y) {
    console.log("Input values:", x, y);

    if (x === y) {
        console.log("Both numbers are equal.");
    } else {
        const max = Math.max(x, y);
        const min = Math.min(x, y);

        console.log(`${max} is the maximum number.`);
        console.log(`${min} is the minimum number.`);
    }
}

// Mathmaxmin(3,30)
// Mathmaxmin(3,-30)
// Mathmaxmin(30,30)


