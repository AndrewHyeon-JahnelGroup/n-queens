// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      
      if (!this.get(rowIndex)) { 
        return false;
      }
      
      return this.get(rowIndex).filter(function(num) { 
        return num === 1; 
      }).length > 1 ? true : false; // fixme 
      
      // var row = this.get(rowIndex);
      // var count = 0;
      // for (var i = 0 ; i < row.length; i++) {
      //   count += row[i];
      //   if(count > 1) {
      //     return true;
      //   }
      // }
      // return false;
    },


    hasAnyRowConflicts: function() {
      for (var i = 0; i < this.rows().length; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var count = 0;
      for (var i = 0; i < this.rows().length; i++) {
        count += this.rows()[i][colIndex];
      }
      return count > 1; // fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      for (var i = 0; i < this.rows().length; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }  
      }
      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var colIdx = majorDiagonalColumnIndexAtFirstRow;
      var length = this.rows().length;
      var count = 0;

      if (colIdx === 0) {
        var numberOfTest = length - 1;
        while (numberOfTest > 0) {
          for (var i = length - numberOfTest - 1; i < length; i++, colIdx++) {
            count += this.rows()[i][colIdx];
          if (count > 1) {
            return true;
          }
            
            
            
            if (colIdx > length - 1) {
              break;
            }
            
          }
          colIdx = 0;
          count = 0;
          numberOfTest --;
        } 
      } else { 
        var j = 0;
        
        while (colIdx < length && colIdx>-1) {
          
          count += this.rows()[j][colIdx];
          colIdx++;
          j++;
          
          if (count > 1) {
            return true;
          }

        }
      }
      
      return false; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      for (var i = 0; i < this.rows().length; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }  
      }
 
      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
       // fixme
      var colidx = minorDiagonalColumnIndexAtFirstRow;
 
      var length = this.rows().length;
      var count = 0;
      if (colidx === length - 1) {
        var numoftest = length - 1;
        while(numoftest > 0) {
           
          for (var rowidx = length - numoftest - 1; rowidx < length; rowidx ++, colidx --) {
            count += this.rows()[rowidx][colidx];
            if (count > 1) {
              return true;
            }
            if (colidx < 1 || rowidx > 2) {
              break;
            }
          } 
          count = 0;
          numoftest --;
          colidx = minorDiagonalColumnIndexAtFirstRow;
        } 
      } else {
        
        for (var i = 0; i < length; i ++, colidx --) {
          if (colidx > -1) {
            count += this.rows()[i][colidx];
            if (count > 1) {
              return true;
            } 
          }
        }     
      }
      return false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      for (var i = 0; i < this.rows().length; i++) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }  
      }
 
      return false;  // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
