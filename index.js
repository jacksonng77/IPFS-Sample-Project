(function () {
    
    	$(document).ready( function () {
		} );
    
       if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
        } else {
            // set the provider you want from Web3.providers
            web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        }
    	ipfs = new window.IpfsApi('ipfs.infura.io', '5001', { protocol: 'https' });
    	ipfs.id(function(err, res) {
 			if (err) throw err
 				console.log("Connected to IPFS node!", res.id, res.agentVersion, res.protocolVersion);
 		});
		web3.eth.defaultAccount = web3.eth.accounts[0];
		var Buffer = window.IpfsApi().Buffer;
    	var ImageContract = web3.eth.contract(
			[
				{
					"anonymous": false,
					"inputs": [],
					"name": "savedHash",
					"type": "event"
				},
				{
					"constant": false,
					"inputs": [
						{
							"name": "x",
							"type": "string"
						}
					],
					"name": "setHash",
					"outputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function"
				},
				{
					"constant": true,
					"inputs": [],
					"name": "getHash",
					"outputs": [
						{
							"name": "x",
							"type": "string"
						}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function"
				}
			]
        );
    
        var ImageContractCall = ImageContract.at('0xf216028e096c969ec85302651de4584a606e9903');
        console.log(ImageContractCall);
    
    	var ipfsHash;
    
        $("#file-upload").change(function() {
      		$("#loader").show();
        	var reader = new FileReader();
  			reader.onload = function() {
                mybuffer = Buffer.from(this.result);
            	ipfs.files.add(mybuffer, function(err, result){
                	if (err) {
    					console.log("Error");
  					} 
                	else {
                    	ipfsHash = result[0].hash;
                    	ImageContractCall.setHash(ipfsHash, {gas: 1000000, gasPrice: web3.toWei(2, 'gwei')}, function(error, result){
   							if(!error){
                            	$("#tx").html("ETH Tx: " + JSON.stringify(result));
                			}
   							else{
       							console.error(error);
                			}
                        });
  					}
                });
			}
			reader.readAsArrayBuffer(this.files[0]);  	
        });
    	var savedHash = ImageContractCall.savedHash();
    	savedHash.watch(function(error, result){
            if (!error)
                {
                	ipfs.pin.add(ipfsHash, function (err) {
                    	if (err){
							console.log("cannot pin");
                        }
                    	else{
                        	console.log("pin ok");
                        }
                    });
                    $("#loader").hide();
                    $("#ipfshash").html("IPFS Hash: " + ipfsHash);
                    $("#imgdiv").html("<img src=https://gateway.ipfs.io/ipfs/" + ipfsHash + " width='400'>");
                } else {
                    $("#loader").hide();
                }
        });
    
} )();
