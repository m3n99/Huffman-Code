
// Define Variables and conect them with HTML to print the values
var InFile='';
let inputfile = document.getElementById('inputfile'); 
let output = document.getElementById("output");
let EntropyHTML = document.getElementById("EntropyHTML");
let AvgLengthHTML = document.getElementById("AvgLengthHTML");
let TotalNumberOfBits = document.getElementById("TotalNumberOfBits");
let EfficiencyHTML = document.getElementById("EfficiencyHTML");
let NumberOfBitsAssci = document.getElementById("NumberOfBitsAssci");

var totalLength;
var Efficiency;
var NumberOfBitsASCII;
var TotalNumberOfBitsInMessage=0.0;
var Entropy=0.0;
var AvgLength=0.0;
var content =" "

// Define varaibles for Objects
var mapObj;
var ObjKeys;
var ObjValues;


// Class for Tree
class Node {  
    constructor(value, char, left, right) {  
        this.val    = value; // number of character occurrences  
        this.char   = char; // character to be encoded  
        this.left   = left;  
        this.right  = right;  
    }  
}

//Huffman coding is a compression algorithm that represents a string sequence in binary  
class huffman{  
    constructor(str){  
        //The first step is to count the frequency of characters  
        let hash = {};  
        for(let i = 0; i < str.length; i++){  
            hash[str[i]] = ~~hash[str[i]] + 1;  
        }  
        this.hash = hash;  
        totalLength=str.length; // store total length of message
        //Constructing Huffman tree  
        this.huffman = this.getTree();  
  
        mapObj = this.HuffmanCode(this.huffman);  

        //Look at the cross reference table, that is, what is the binary encoding of each character  
        console.log(mapObj);
        ObjKeys= Object.keys(mapObj);
        ObjValues =Object.values(mapObj);
        //Final binary encoding  
        this.binaryStr = this.BinaryToStr(mapObj, str);  
    }  
  
    //Constructing Huffman tree  
    getTree(){  
        //The number of occurrences of each character is node.val , tectonic forest  
        let forest = []  
        for(let char in this.hash){  
            let node = new Node(this.hash[char], char); 
            forest.push(node);  
        }  
  
        //When there is only one node left in the forest, the merging process is finished and the tree is generated  
        let allnodes = []; // stores the merged nodes, because any node in the forest cannot be deleted, otherwise. Left. Right will not find the node  
        while(forest.length !== 1){  
            //Find the two smallest trees in the forest and merge them  
            forest.sort((a, b) => {  
                return a.val - b.val;  
            });  
            
            //store values as leafies
            let node = new Node(forest[0].val + forest[1].val, '');  
            allnodes.push(forest[0]);  
            allnodes.push(forest[1]);  
            node.left  = allnodes[ allnodes.length  -1]; // the left subtree places words with low frequency  
            node.right  = allnodes[ allnodes.length  -2]; // the right subtree places the word frequency high  
  
            //Delete the two smallest trees  
            forest = forest.slice(2);  
            //Added tree join  
            forest.push(node);  
        }  
  
        //Generated Huffman tree  
        return forest[0];  
    }  
  
    //Traverse the Huffman tree and return a table of original characters and binary codes  
    HuffmanCode(tree){  
        let hash = {}; // cross reference table
        let traversal = (node, curPath) => {  
            // conditions to give 1 ot 0 to the leaf
            if (!node.length && !node.right) return;  
            if (node.left && !node.left.left && !node.left.right){  
                hash[node.left.char] = curPath + '1';  
            }  
            if (node.right && !node.right.left && !node.right.right){  
                hash[node.right.char] = curPath + '0';  
            }  
            //Traverse to the left and add 0 to the path  
            if(node.left){  
                traversal(node.left, curPath + '1');  
            }  
            //Go right and add 1 to the path  
            if(node.right){  
                traversal(node.right, curPath + '0');  
            }  
        };  
        traversal(tree, '');  
        return hash;  
    }  
  
    //Returns the final compressed binary string  
    BinaryToStr(mapObj, originStr){  
        let result = '';  
        for(let i = 0; i < originStr.length; i++){  
            result += mapObj[originStr[i]];  
        }  
        return result;  
    }  
}


// Function to read file , calculations and connect with HTML
inputfile.addEventListener('change', function() {
    var fr=new FileReader(); // var to read and store
    fr.onload=function(){
        InFile=fr.result.toLocaleLowerCase(); // output from file all Lower case since it not ask (do not
        //distinguish between capital and small letters)
        output.innerHTML=InFile;

        let tree = new huffman(InFile); // give the data to the calsses to make cal
        let hashTree = tree.hash;
        let hashTreeKeys = Object.keys(hashTree);
        let HashTreeValues =Object.values(hashTree);

        // for loop to compares between mapObj and hasTree and store and implement the correct values
        for (let i = 0; i < hashTreeKeys.length; i++) {
            for(let j = 0; j < ObjKeys.length; j++) {
                if(hashTreeKeys[i]==ObjKeys[j]){ // if the comapre true 
                    let probability = (HashTreeValues[i]/totalLength).toFixed(8); // cal propb. for each symbol, tofixed give 8 values after comma
                    Entropy += (probability * (Math.log(probability)/Math.log(2)))*(-1); // cal entrpoy for each symbol
                    AvgLength+= probability*ObjValues[j].length; // cal avg codeword length 
                    TotalNumberOfBitsInMessage+= HashTreeValues[i]*ObjValues[j].length;
                    //console.log(hashTreeKeys[i]+",Frequency="+HashTreeValues[i]+","+"P("+hashTreeKeys[i]+") ="+probability+","+ObjValues[j]+" "+ObjValues[j].length);
                    
                    // for moce print in the HTML page
                    content += `<tr>
                    <td>`+(i+1)+`</td>
                    <td>`+hashTreeKeys[i]+`</td>
                    <td>`+HashTreeValues[i]+`</td>
                    <td>`+"P("+hashTreeKeys[i]+") ="+probability+`</td>
                    <td>`+ObjValues[j]+`</td>
                    <td>`+ObjValues[j].length+`</td>
                    </tr>`;  
                }
            }            
        }
        tableBody.innerHTML=content; // to connect with HTML
        

        NumberOfBitsASCII = totalLength * 8; // cal total number of bits in Ascii
        Efficiency = ((TotalNumberOfBitsInMessage/NumberOfBitsASCII)*100).toFixed(3); // cal Efficiency

        // print in consloe to see our resultis 
        console.log("Entropy of the alphabet = "+Entropy+" bits/character");
        console.log("Average Number = "+AvgLength+" bits/character");
        console.log("Number of Bits in ASCII= "+NumberOfBitsASCII);
        console.log("Total Number Of Bits In Message= "+TotalNumberOfBitsInMessage);
        console.log("Efficiency = "+Efficiency+"%");
        
        // connect with HTML 
        EntropyHTML.innerHTML=Entropy;
        AvgLengthHTML.innerHTML=AvgLength;
        TotalNumberOfBits.innerHTML=TotalNumberOfBitsInMessage;
        EfficiencyHTML.innerHTML=Efficiency;
        NumberOfBitsAssci.innerHTML=NumberOfBitsASCII;
    }

    fr.readAsText(this.files[0]);
})
