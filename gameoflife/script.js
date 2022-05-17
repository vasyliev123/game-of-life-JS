const rows =300;
const cols =300;
let playing = false;
const grid = new Array(rows)
const nextGrid = new Array(rows)
let timer;
const repTime = 1;
initialize=()=>
{
    createTable();
    initializeGrid();
    navInit();
}

createTable=()=>{
    const gridContainer = document.getElementById("gridContainer");

    const table = document.createElement("table");
    console.log("created table")
    if (!gridContainer) {
        // Throw error
        console.error("Problem: No div for the grid table!");
    }
    for (let i = 0;i<rows;i++)
    {
        const tr = document.createElement("tr");
            for (let j = 0;j<cols;j++)
            {
                const cell = document.createElement("td");
                cell.setAttribute("id",i+"_"+j);
                cell.setAttribute("class","dead");
                cell.textContent="";
                cell.addEventListener("click",  function() {
                    cellClickHandler(cell.getAttribute("id"),cell.getAttribute("class"));
                });
                tr.appendChild(cell);

            }
            table.appendChild(tr);
    }
    gridContainer.appendChild(table);
}
initializeGrid=()=>
{
    for (let i = 0;i<rows;i++)
    {
        grid[i]=new Array(cols);
        nextGrid[i]=new Array(cols);
    }
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
        grid[i][j]=0;
        nextGrid[i][j]=0;

        }
    }
}

navInit=()=>
{
    const startBtn = document.getElementById("start");
    startBtn.onclick = startBtnClickHandler;
    const resetBtn = document.getElementById("reset");
    resetBtn.onclick = resetBtnClickHandler;
    const randBtn = document.getElementById("random");
    randBtn.onclick = randBtnClickHandler;
}
startBtnClickHandler=()=>
{

    if(playing)
    {
        playing=false;
        document.getElementById('start').textContent="Continue";
    }
    else
    {
        playing=true;
        document.getElementById('start').textContent="Pause";
        start();
    }

}
resetBtnClickHandler=()=> {
    playing = false;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j]=0;
            nextGrid[i][j]=0;
            document.getElementById(i+'_'+j).setAttribute("class","dead");
            document.getElementById('start').textContent="Start";
        }
    }

}
randBtnClickHandler=()=>
{
    if(playing) return
    else
    {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const cell = document.getElementById(i + "_" + j);
                if(Math.floor(Math.random() * 2)===1.0) {
                    cell.setAttribute("class", "dead");
                    grid[i][j]=0;
                }
                else {
                    cell.setAttribute("class","alive")
                    grid[i][j]=1;
                }
            }
        }
    }

}
cellClickHandler=(c_id,c_class)=>
{
        const rc = c_id.split("_");
        const row= rc[0];
        const cell = rc[1];
        if(c_class==="dead")
        {
            grid[row][cell]=1;
            document.getElementById(c_id).setAttribute("class","alive");

        }
        else
        {
            grid[row][cell]=0;
            document.getElementById(c_id).setAttribute("class","dead");
        }
     console.log(row+cell);

}
const mod = (a, b) => ((a % b) + b) % b
start=()=>
{

    nextGeneration();
    if(playing)
    {
        timer=setTimeout(start,repTime);
    }
}

nextGeneration=()=>
{
    console.log("next gen!");

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            applyRules(i,j);
        }
    }
    swapAndResetGrid();
    updateTable();
}
applyRules=(i,j)=>
{
    //console.log("rules applied!");
    let _checkNeighbors = checkNeighbors(i,j);
    if(grid[i][j]===1) {
        if (_checkNeighbors < 2) {
            nextGrid[i][j] = 0;
        }
        if (_checkNeighbors === 2 || _checkNeighbors === 3) {
            nextGrid[i][j] = 1;
        }
        if (_checkNeighbors > 3) {
            nextGrid[i][j] = 0;
        }
    }
     if (grid[i][j]===0){
        //console.log(i+"_"+j);
        if(_checkNeighbors===3)
        {
            nextGrid[i][j]=1;
          // console.log(i+"_"+j +"is dead and added");
        }
    }

}
returnElement=(arr,indexX,indexY)=>
{
    indexX = indexX % rows;
    indexX = indexX + rows; // If index is negative, modulus division gives us negative result, so this makes it positive.
    indexX = indexX % rows; // In case the previous step made index >= n

    indexY = indexY % cols;
    indexY = indexY + cols; // If index is negative, modulus division gives us negative result, so this makes it positive.
    indexY= indexY % cols; // In case the previous step made index >= n
    return arr[indexX][indexY];

}
checkNeighbors=(row,col)=>
{
    let count =0;

    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let row1 = (row+i+rows)%rows;
            let col1 = (col+j+cols)%cols;
            count+=grid[row1][col1];
        }
    }
    count-=grid[row][col];
    // if(adjacentsquares>0)
    // console.log("neigh" + row+"_"+col+" "+count);
    console.log(9%rows);
    return count;
}
swapAndResetGrid=()=>
{
    //console.log("swaped!");
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j]=nextGrid[i][j];
            nextGrid[i][j]=0;
        }
    }
}
updateTable=()=>
{
    //console.log("updated!");
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if(grid[i][j]===1)
            {

                document.getElementById(i+"_"+j).setAttribute("class","alive");
            }
            else
                document.getElementById(i+"_"+j).setAttribute("class","dead");
        }
    }
}
window.onload=initialize;