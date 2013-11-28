exports.have = {
  test : function(a){
          return { val: 1, scope : {test : 1 }, exec : "alert('test')" } ;
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
    console.log("newItem", newItem)
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
  }
}
