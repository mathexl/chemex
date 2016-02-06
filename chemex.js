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
["water","an oxygen atom has a single bond  to a hydrogen atom and a single bond hydrogen atom"],
    ["table salt","a sodium atom single bonded to a chloride atom"]
  ]

  for(i = 0; i < special_molecules.length; i++){
    if(str.indexOf(special_molecules[i][0]) != -1){
      Regex = new RegExp(special_molecules[i][0],"ig");
      str = str.replace(Regex,special_molecules[i][1])
    }
  }

  swaps = [];
  counter = 100;
  while(str.indexOf(", which is") != -1){
    start = str.indexOf(", which is");
    nextcomma = str.indexOf(",",start+2);
    if(nextcomma == -1){
      nextcomma = str.length;
    }
    swaps.unshift([str.substring(start,nextcomma),counter]);
    console.log(swaps);
    str = str.substring(0,start) + "   FLAG" + counter + str.substring(nextcomma+1);
    counter++;
  }

  console.log(str);

  return [str,swaps];
}

function breakparts(str){
    arr = str.split(",");
    return arr;
}

function convert(str){
  schema = new Schema();
  arr = prime(str);
  swaps = arr[1];
  arr = breakparts(arr[0]);
  for(l = 0; l < arr.length; l++){
    re = parse(arr[l]);
    schema.add(re);
  }
  html = schema.mapper(swaps);
  return html;
}

function parsebonds(str){

  keywords = [
    ["single bond","singlebond"],
    ["double bond","doublebond"],
    ["triple bond","triplebond"]
  ];
  var toadd = [];
  strs = str.split("and");
  console.log(strs);
  found = false;

  for(e = 0; e < strs.length; e++){
    atom_place = strs[e].indexOf("atom");
    for(t = 0; t < keywords.length; t++){
      if(strs[e].indexOf(keywords[t][0]) != -1 && atom_place > strs[e].indexOf(keywords[t][0])){
        found = true;
        bond = keywords[t][1];
        toadd.unshift([strs[e].substring(strs[e].indexOf(keywords[t][0])+keywords[t][0].length),bond]);
      }
    }
  }


  if(found == false){
    return null;
  }
  for(o = 0; o < toadd.length; o++){
    bondtype = toadd[o][1];
    console.log(toadd[o][0]);
    toadd[o] = parse(toadd[o][0]);
    toadd[o].bondtype = bondtype;
  }

  return toadd;
}

var Molecule = function(str){
  this.str = str;
}

var Schema = function(){
  this.atoms = [];
}

function addbonds(atom, str){

  keywords = [
    ["single bond","singlebond"],
    ["double bond","doublebond"],
    ["triple bond","triplebond"]
  ];
  var toadd = [];
  strs = str.split("and");
  console.log(strs);
  found = false;

  for(e = 0; e < strs.length; e++){
    atom_place = strs[e].indexOf("atom");
    for(t = 0; t < keywords.length; t++){
      if(strs[e].indexOf(keywords[t][0]) != -1 && atom_place > strs[e].indexOf(keywords[t][0])){
        found = true;
        bond = keywords[t][1];
        toadd.unshift([strs[e].substring(strs[e].indexOf(keywords[t][0])+keywords[t][0].length),bond]);
      }
    }
  }


  if(found == false){
    return null;
  }
  for(o = 0; o < toadd.length; o++){
    bondtype = toadd[o][1];
    console.log(toadd[o][0]);
    if(atom.bonds == null){
      atom.bonds = [];
    }
    atom.bonds.unshift(parse(toadd[o][0]));
    len = atom.bonds.length;
    atom.bonds[len-1].bondtype = bondtype;
  }

  console.log(atom);

  return atom;
}

function writeHTML(atom,x_cor,y_cor,swaps){
  endHTML = "";
  var html = "";

  if(atom.str.indexOf("FLAG") != -1 && atom.str.indexOf("FLAG") < atom.str.indexOf("atom") ||
      atom.str.indexOf("FLAG") != -1 && atom.str.indexOf("atom") == -1
 ){
    flagpos = atom.str.indexOf("FLAG");
    flag = atom.str.substring(flagpos,flagpos+7);
    for(d = 0; d < swaps.length; d++){
      if("FLAG" + swaps[d][1] == flag){
        atom = addbonds(atom,swaps[d][0]);
        break;
      }
    }
  }


  movement_arr = [[1,-1,true],[1,1,true],[-1,1,"up"],[-1,-1,"down"]];
    html = html + "<div chempart box" + x_cor + "_" + y_cor + ">" + atom.symbol + "</div>";
    if(atom.bonds != null){
      for(k = 0; k < atom.bonds.length; k++){
        if(k == 0 && atom.ref == "up"){
          html = html + "<hr " + atom.bondtype + ">";
          html = html + "<hr>";
          continue;
        }
        if(k == 1 && atom.ref == "down"){
          html = html + "<hr " + atom.bondtype + ">";
          html = html + "<hr>";
          continue;
        }
        if(movement_arr[k][2] == true){
          html = html + "<hr " + atom.bonds[k].bondtype + ">";
          html = html + "<hr>";
          endHTML = endHTML + writeHTML(atom.bonds[k],x_cor+movement_arr[k][0],y_cor+movement_arr[k][1],swaps);
        } else {
          atom.bonds[k].ref = movement_arr[k][2];
          endHTML = endHTML + writeHTML(atom.bonds[k],x_cor+movement_arr[k][0],y_cor+movement_arr[k][1],swaps);
        }
      }
    } else {
      if(atom.ref == "up"){
        html = html + "<hr " + atom.bondtype + ">";
        html = html + "<hr>";
      }
      if(atom.ref == "down"){
        html = html + "<hr>";
        html = html + "<hr>";
        html = html + "<hr " + atom.bondtype + ">";
        html = html + "<hr>";
      }
    }
    return html + endHTML;
  }



Schema.prototype =  {
  add: function(obj){
    this.atoms.unshift(obj);
    console.log(this.atoms);
  },
  mapper: function(swaps){
    x_cor = 3;
    y_cor = 3;
    atom = this.atoms[0];
    html = writeHTML(atom,x_cor,y_cor,swaps);
    return html;
  }
}

var Oxygen = function(str){
  Molecule.call(this,str);
  this.bonds = parsebonds(str);
  this.symbol = "O";
}

var Hydrogen = function(str){
  Molecule.call(this,str);
  this.bonds = parsebonds(str);
  this.symbol = "H";

}

var Nitrogen = function(str){
  Molecule.call(this,str);
  this.bonds = parsebonds(str);
  this.symbol = "N";

}

var Sodium = function(str){
  Molecule.call(this,str);
  this.bonds = parsebonds(str);
  this.symbol = "Na";

}

var Chloride = function(str){
  Molecule.call(this,str);
  this.bonds = parsebonds(str);
  this.symbol = "Cl";
}

var Carbon = function(str){
  Molecule.call(this,str);
  this.bonds = parsebonds(str);
  this.symbol = "C";
}



function parse(str){
  console.log(str);
  elements = ["oxygen","hydrogen","sodium","chloride","nitrogen","carbon"];
  minimum = str.length;
  for(p = 0; p < elements.length; p++){
    if(str.indexOf(elements[p]) != -1 && str.indexOf(elements[p]) < minimum){
      minimum = str.indexOf(elements[p]);
      chosen = elements[p];
    }
  }

  pos = str.indexOf(chosen);
  retaining_string = str.substring(pos+chosen.length+6);
  if(chosen == "oxygen"){
    atom = new Oxygen(retaining_string);
  } else if(chosen == "hydrogen"){
    atom = new Hydrogen(retaining_string);
  } else if(chosen == "sodium"){
    atom = new Sodium(retaining_string);
  } else if(chosen == "chloride"){
    atom = new Chloride(retaining_string);
  } else if(chosen == "nitrogen"){
    atom = new Nitrogen(retaining_string);
  } else if(chosen == "carbon"){
    atom = new Carbon(retaining_string);
  } else {
    atom = null;
  }

  console.log(atom);
  return atom;


}
