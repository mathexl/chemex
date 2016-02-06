/* Copyright 2016 Mathew Pregasen - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the Apache license, for ONLY educational or
 * non-profit use.  YOU ARE PROHIBITED to use this code for
 * commercial means without prior approval and/or license
 * from the owner above.  If you are interested in seeking
 * such license, please contact Mathew Pregasen
 * at mdp2163@columbia.edu.
 */




function wordsafter(str,word,num,start){
    str = str + " ";
    if(start == undefined){
        start = 0;
    }
    if(num == undefined){
        num = 1;
    }

    if(str.indexOf(word,start) != -1){
        start = str.indexOf(word,start);
        counter = 0;
        while(counter < num){
            nextspace = str.indexOf(" ", start);
            spaceafter = str.indexOf(" ", nextspace+1);
            start = spaceafter-1;
            counter++;
        }
        return str.substring(nextspace,spaceafter);
    } else {
        return -1;
    }
}


function wordsbefore(str,word,num,start){
    str = str + " ";
    if(start == undefined){
        start = str.length;
    }
    if(num == undefined){
        num = 1;
    }

    if(str.lastIndexOf(word,start) != -1){
        start = str.lastIndexOf(word,start);
        counter = 0;
        while(counter < num){
            nextspace = str.lastIndexOf(" ", start-2);
            spaceafter = str.indexOf(" ", nextspace+1);
            start = spaceafter-1;
            counter++;
        }
        return str.substring(nextspace,spaceafter);
    } else {
        return -1;
    }
}

function termsbefore(str,f){

}



function itemafter(str,start,names){
    for(t = 0; t < names.length; t++){
        n = " " + names[t]
        if(str.indexOf(n,start) != -1){
            item = str.indexOf(n,start);
            spacebefore = str.lastIndexOf(" ",item);
            ret = str.substring(spacebefore+1,item+5);
            ret = ret.replace(" ","");
            ret = ret.replace(",","");
            return ret;
        }
    }
}


function itembefore(str,start,names){
    str = str + " ";
    for(t = 0; t < names.length; t++){
        n = " " + names[t]
        if(str.lastIndexOf(n,start) != -1){
            item = str.lastIndexOf(n,start);
            spacebefore = str.lastIndexOf(" ",item);
            ret = str.substring(spacebefore+1,item+5);
            ret = ret.replace(" ","");
            ret = ret.replace(",","");
            return ret;
        }
    }
}



/********* BOARD DISPLAY ENGINE **********/
var Board = function(x,y){

    this.prototype = Board.prototype;
}

Board.prototype = {


}

/*********** MAIN PARSER *********************/

var Chemex = function(str){
    this.str = str;
    this.html = convert(str);
}

function convert(str){
  str = prime(str);
  console.log(str);
}

function prime(str){

  enumaration = [["two",2],["three",3],["four",4],["five",5]];
  for(i = 0; i < enumaration.length; i++){
    while(str.indexOf(enumaration[i][0]) != -1){
      identifier = str.indexOf(enumaration[i][0]);
      molecules_position = str.indexOf("molecules");
      start = identifier + enumaration[i][0].length;
      num = enumaration[i][1];
      addstr = "";
      for(k = 0; k < num; k++){
        addstr = addstr + "(" + str.substring(start,molecules_position+9) + ")";
        if(k + 2 == num){
          addstr = addstr + " and ";
        } else {
          addstr = addstr + ", ";
        }
      }
      str = str.substring(0,identifier) + addstr + str.substring(molecules_position+9);
    }
  }

  special_molecules = [
["water molecule","oxygen molecule single bonded  to a hydrogen molcule and a hydrogen molecule"],
    ["table salt","a sodium atom single bonded to a chloride atom"]
  ]

  for(i = 0; i < special_molecules.length; i++){
    if(str.indexOf(special_molecules[i][0]) != -1){
      Regex = new RegExp(special_molecules[i][0],"ig");
      str = str.replace(Regex,special_molecules[i][1])
    }
  }
  return str;
}
