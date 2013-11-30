exports.have = {
  test : function(a,b){
          var value = (parseInt(b)+1) * (parseInt(b)+1);
          var exec = "document.getElementById('"+a+"').innerHTML = "+value+"; document.getElementById('status').innerHTML = 'success';";
          return { val: 'success', scope : {test : 1 }, exec : exec, local : {test1 : 1 } } ;
        },
  test2 : function(a,b){
          return { scope : {status : 'ready!' } } ;
        },        
  sum : function(a,b){
          return { val : a + b }
        },
  secretWord : function(){
                 //do magic
                 return 'abracadabra'
               },
  loadBoard : function(name, boards){
    var $scope = {}
    $scope.boards = boards;
    var origName = name;
    name = name.toLowerCase();

    if(!$scope.boards[name]){
      $scope.boards[name] = {name : origName, items : [] } ;
    }
    $scope.board = name;
    $scope.boardName = '';
    $scope.sum = 1+2;

    return {scope : $scope , exec : "console.log('board loaded!')"  }

  },
  addItem : function(board, boards, newItem){
    var $scope = { board : board, boards : boards, newItem: newItem}
    var bName = $scope.board;
    if($scope.boards[bName].items)
    {
        $scope.boards[bName].items.push({name : $scope.newItem, vote : 0 })
    } else {
        $scope.boards[bName].items = [{name : $scope.newItem, vote : 0 }]
    };
    $scope.newItem = '';
    return  {scope : $scope, exec : "console.log('list item added!')"   }
  },
  clearBoard : function(){
    var $scope = {board : ''}
    return  {scope : $scope, exec : "console.log('board cleared')"   }
  },
  vote : function(vote, idea, board, boards){
    var $scope = {boards : boards}
    for(var i in $scope.boards[board].items){
      if($scope.boards[board].items[i].name === idea.name){
        $scope.boards[board].items[i].vote += vote
        return {scope : $scope, exec : "console.log('board updated')"   }
      }
    }
  },
  setup : function(){
    var $scope = {};

    $scope.cellStyle= {
        'height': '40px',
        'width': '40px',
        'border': '1px solid black',
        'text-align': 'center',
        'vertical-align': 'middle',
        'cursor': 'pointer'
      };
        $scope.userLetter = 'O';
        $scope.systemLetter = 'X';
    
        $scope.turn = 0;
    
        $scope.gameover = false;
        $scope.winmessage = '';
    
        $scope.start = 'system';
    
        $scope.isGameStarted = false;

    $scope.rows = [
        [
            {
                'id' : 'A11',
                'letter': '',
                'class': 'box'
            },
            {
                'id' : 'A12',
                'letter': '',
                'class': 'box'
            },
            {
                'id' : 'A13',
                'letter': '',
                'class': 'box'
            }
        ],
        [
            {
                'id' : 'B11',
                'letter': '',
                'class': 'box'
            },
            {
                'id' : 'B12',
                'letter': '',
                'class': 'box'
            },
            {
                'id' : 'B13',
                'letter': '',
                'class': 'box'
            }
        ],
        [
            {
                'id' : 'C11',
                'letter': '',
                'class': 'box'
            },
            {
                'id' : 'C12',
                'letter': '',
                'class': 'box'
            },
            {
                'id' : 'C13',
                'letter': '',
                'class': 'box'
            }
        ]
    ];
    return {scope : $scope };
  },
  markUserClick : function(col_index, row_index, rows, turn, userLetter){
    var $scope = {rows : rows};
    var exec = "";
    $scope.turn = turn;
    $scope.userLetter = userLetter;
    if($scope.turn == 1 && ($scope.rows[row_index][col_index].letter == '' || !$scope.rows[row_index][col_index].letter )) {
        $scope.rows[row_index][col_index].letter = $scope.userLetter;
        $scope.turn = 0;
        exec = "$scope.think('$SCOPE');"
    }    
    return {scope : $scope, exec : exec};
  },
  markTheOne : function(scope, box1, box2, box3, letter){
    var systemLetter = scope.systemLetter;
    var textToLookFor = letter + letter;
    if(scope.rows[box1[0]][box1[1]].letter + scope.rows[box2[0]][box2[1]].letter + scope.rows[box3[0]][box3[1]].letter == textToLookFor) {

        if(!scope.rows[box1[0]][box1[1]].letter) {
            scope.rows[box1[0]][box1[1]].letter = systemLetter;
        }
        else if(!scope.rows[box2[0]][box2[1]].letter) {

            scope.rows[box2[0]][box2[1]].letter = systemLetter;
        }
        else {
            scope.rows[box3[0]][box3[1]].letter = systemLetter;
        }
        return {val : true};
    }
    return {val : false};
  },
  fillTheEmptySpot : function(scope, letter){
    var parent = exports.have;
    for(var count=0; count < scope.rows.length; count++) {
        if(parent.markTheOne(scope, [count,0], [count, 1], [count, 2], letter).val ||
            parent.markTheOne(scope, [0 , count], [1, count], [2, count], letter).val ) {
            return {val : true};
        }
    }
    if( parent.markTheOne(scope, [0, 0], [1, 1], [2, 2], letter).val ||
        parent.markTheOne(scope, [2, 0], [1, 1], [0, 2], letter).val ) {
        return {val : true};
    }
    return {val : false};    
  },
  isCornerSpot : function(x,y){
    var value = "";
    value = ( (x == 0 && y == 0) || (x == 0 && y == 2) || (x == 2 && y == 0) || (x == 2 && y == 2) );
    return {val : value};
  },
  getInFork : function(scope, letter){
    var parent = exports.have;
    // brute force to see which cell creates better fork.
    var bestSpot;
    var bestScore = 0;
    for(var rCount=0; rCount < scope.rows.length; rCount++) {
        var currentRow = scope.rows[rCount];
        for(var cCount=0; cCount < currentRow.length; cCount++) {
            var currentSpot = currentRow[cCount];
            var currentScore = 0;
            if(currentSpot.letter === '') {
                var presentRowString = currentRow[0].letter + currentRow[1].letter + currentRow[2].letter;
                if(presentRowString == letter) {
                    currentScore++;
                }
                var presentColumnString = scope.rows[0][cCount].letter + scope.rows[1][cCount].letter + scope.rows[2][cCount].letter;
                if(presentColumnString == letter) {
                    currentScore++;
                }
                if(parent.isCornerSpot(rCount, cCount).val && rCount != 1 && cCount != 1) {
                    var presentDiagonalString = currentSpot.letter + scope.rows[1][1].letter + scope.rows[((rCount + 2) > 2 ? 0 : 2)][((cCount + 2) > 2 ? 0 : 2)].letter;
                    if(presentDiagonalString == letter) {
                        currentScore++;
                    }
                }
                if(rCount == 1 && cCount == 1) {
                    var diagonal1String = scope.rows[0][0].letter + scope.rows[1][1].letter + scope.rows[2][2].letter;
                    var diagonal2String = scope.rows[0][2].letter + scope.rows[1][1].letter + scope.rows[2][0].letter;
                    if(diagonal1String == letter) {
                        currentScore++;
                    }
                    if(diagonal2String == letter) {
                        currentScore++;
                    }
                }
                if(currentScore > bestScore) {
                    bestScore = currentScore;
                    bestSpot = currentSpot;
                }
            }
        }
    }
    if(bestScore > 1) {
        bestSpot.letter = scope.systemLetter;
        return {val : true};
    }
    return {val : false};
  },
  targetCorner : function(oppositeToOpponentFlag, scope){
    var parent = exports.have;

        if(scope.rows[0][0].letter + scope.rows[2][2].letter == scope.userLetter) {
            (scope.rows[0][0].letter ==  scope.userLetter) ? (scope.rows[2][2].letter = scope.systemLetter) : (scope.rows[0][0].letter = scope.systemLetter);
            return {val : true, scope : scope};
        }
        if(scope.rows[2][0].letter + scope.rows[0][2].letter == scope.userLetter) {
            (scope.rows[2][0].letter ==  scope.userLetter) ? (scope.rows[0][2].letter = scope.systemLetter) : (scope.rows[2][0].letter = scope.systemLetter);
            return {val : true, scope : scope};
        }
        if(!oppositeToOpponentFlag) {
            for(var rCount=0; rCount < scope.rows.length; rCount++) {
                for(var cCount=0; cCount < scope.rows[rCount].length; cCount++) {
                    if(parent.isCornerSpot(rCount, cCount).val && scope.rows[rCount][cCount].letter == '') {
                        scope.rows[rCount][cCount].letter = scope.systemLetter;
                        return {val : true, scope : scope};
                    }
                }
            }
        }
        return {val : false};
  },
  playAtEmptySpot : function(scope){
    for(var rCount=0; rCount < scope.rows.length; rCount++) {
      for(var cCount=0; cCount < scope.rows[rCount].length; cCount++) {
          if(scope.rows[rCount][cCount].letter == '') {
              scope.rows[rCount][cCount].letter = scope.systemLetter;
              return;
          }
      }
    }
    return;
  },
  checkWin : function(letter, scope){
    var textToLookFor = letter + letter + letter;
    for(var count=0; count < scope.rows.length; count++) {
        if( scope.rows[count][0].letter + scope.rows[count][1].letter + scope.rows[count][2].letter == textToLookFor ) {
            scope.rows[count][0].class = scope.rows[count][1].class = scope.rows[count][2].class = 'winbox';
            return {scope : scope, val : true};
        }
        if( scope.rows[0][count].letter + scope.rows[1][count].letter + scope.rows[2][count].letter == textToLookFor ) {
            scope.rows[0][count].class = scope.rows[1][count].class = scope.rows[2][count].class = 'winbox';
            return {scope : scope, val : true};
        }
    }
    if( scope.rows[0][0].letter + scope.rows[1][1].letter + scope.rows[2][2].letter == textToLookFor ) {
        scope.rows[0][0].class = scope.rows[1][1].class = scope.rows[2][2].class = 'winbox';
        return {scope : scope, val : true};

    }
    if( scope.rows[2][0].letter + scope.rows[1][1].letter + scope.rows[0][2].letter == textToLookFor ) {
        scope.rows[2][0].class = scope.rows[1][1].class = scope.rows[0][2].class = 'winbox';
        return {scope : scope, val : true};
    }
    return {val : false};

  },
  checkDraw : function(rows){
    var $scope = {rows : rows};
          for(var rCount=0; rCount < $scope.rows.length; rCount++) {
            for(var cCount=0; cCount < $scope.rows[rCount].length; cCount++) {
                if($scope.rows[rCount][cCount].letter === '') {
                    return {val : false};
                }
            }
        }
        return {val : true};
  },
  setUserTurn : function(scope){
    var parent = exports.have;
    var checkWin = parent.checkWin(scope.systemLetter, scope)
    if(checkWin.val) {
        scope.winmessage = 'AI WINS!';
        scope.gameover = true;
    }
    else {
        if(parent.checkDraw(scope.rows).val){
          scope.winmessage = 'Its a draw!';
          scope.gameover = true;
        } else {
          scope.turn = 1;
        }
        
    }
    return {scope : scope};
  },
  think : function(scope){
    var parent = exports.have;
    //console.log(scope)
    var checkWin = parent.checkWin(scope.userLetter, scope);
    if(checkWin.val) {
        scope.winmessage = 'YOU WIN!';
        scope.gameover = true;
        return {scope : scope};
    }
    if(parent.checkDraw(scope.rows).val){
          scope.winmessage = 'Its a draw!';
          scope.gameover = true;
          return {scope : scope};
    }

    if(parent.fillTheEmptySpot(scope, scope.systemLetter).val) {
        return parent.setUserTurn(scope);
    }

    if(parent.fillTheEmptySpot(scope, scope.userLetter).val) {
        return parent.setUserTurn(scope);
    }

    if(parent.getInFork(scope, scope.systemLetter).val) {
        return parent.setUserTurn(scope);
    }

    if(parent.getInFork(scope, scope.userLetter).val) {
        return parent.setUserTurn(scope);
    }
    if(scope.rows[1][1].letter == '' && Math.floor(Math.random() * 2) ) {
        scope.rows[1][1].letter = scope.systemLetter;
        return parent.setUserTurn(scope);
    }
    var p1 = parent.targetCorner(true, scope)
    if(p1.val) {
        return parent.setUserTurn(scope);
    }
    var p2 = parent.targetCorner(false, scope);
    if(p2.val) {
        return parent.setUserTurn(scope);
    }

    parent.playAtEmptySpot(scope);
    return parent.setUserTurn(scope);
  },
  startGame : function(rows, start, userLetter, systemLetter){
    var parent = exports.have;
    var $scope = {rows : rows, start : start, userLetter : userLetter , systemLetter : systemLetter};
    $scope.gameover = false;
    for(var row in $scope.rows) {
            $scope.rows[row][0].letter = $scope.rows[row][1].letter = $scope.rows[row][2].letter = '';
            $scope.rows[row][0].class = $scope.rows[row][1].class = $scope.rows[row][2].class = 'box';
    };

    $scope.isGameStarted = true;
    if($scope.start == 'system') {
        $scope.turn = 0;
        parent.think($scope);
    }
    else {
        $scope.turn = 1;
    }
    return {scope : $scope}
  } 

};
