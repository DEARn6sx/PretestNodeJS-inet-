function factorail(x) {
    let sum = 1
    for (let index = 1; index <= x ; index++) {
        sum = sum * index
        
    }
    console.log(`%d! = %d`,x,sum);
}

factorail(6)