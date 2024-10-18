from flask import Flask, request, jsonify, render_template
from web3 import Web3
import os

app = Flask(__name__)

# Load environment variables
infura_url = os.getenv("INFURA_PROJECT_URL")
private_key = os.getenv("PRIVATE_KEY")
contract_address = os.getenv("CONTRACT_ADDRESS")

# Initialize Web3
w3 = Web3(Web3.HTTPProvider(infura_url))

# Check if connected to Ethereum network
if not w3.is_connected():
    raise Exception("Failed to connect to Ethereum network")

# Load your smart contract ABI
contract_abi = [
    # ... (your contract ABI goes here)
]

# Initialize contract
contract = w3.eth.contract(address=contract_address, abi=contract_abi)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register_donor', methods=['POST'])
def register_donor():
    data = request.json
    donor_address = data.get("donor_address")
    organ_type = data.get("organ_type")  # e.g., 0 for kidney, 1 for heart, etc.

    # Prepare the transaction
    nonce = w3.eth.get_transaction_count(donor_address)
    txn = contract.functions.registerDonor(organ_type).build_transaction({
        'chainId': 1,  # Mainnet
        'gas': 2000000,
        'gasPrice': w3.to_wei('50', 'gwei'),
        'nonce': nonce,
    })

    # Sign the transaction
    signed_txn = w3.eth.account.sign_transaction(txn, private_key)
    
    # Send the transaction
    txn_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
    
    # Wait for the transaction receipt
    txn_receipt = w3.eth.wait_for_transaction_receipt(txn_hash)
    
    return jsonify({"txn_hash": txn_hash.hex(), "status": "success"})

@app.route('/get_donor/<int:donor_id>', methods=['GET'])
def get_donor(donor_id):
    donor = contract.functions.getDonor(donor_id).call()
    
    if donor:
        return jsonify({
            "id": donor[0],
            "address": donor[1],
            "organ": donor[2],
            "status": donor[3],
            "donation_date": donor[4]
        })
    else:
        return jsonify({"error": "Donor not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)