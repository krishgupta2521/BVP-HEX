from flask import Flask, request, jsonify, render_template, redirect, url_for
import sqlite3
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
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_donorId",
				"type": "uint256"
			}
		],
		"name": "completeDonation",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": False,
		"inputs": [
			{
				"indexed": True,
				"internalType": "uint256",
				"name": "donorId",
				"type": "uint256"
			},
			{
				"indexed": True,
				"internalType": "uint256",
				"name": "recipientId",
				"type": "uint256"
			}
		],
		"name": "DonationCompleted",
		"type": "event"
	},
	{
		"anonymous": False,
		"inputs": [
			{
				"indexed": True,
				"internalType": "uint256",
				"name": "donorId",
				"type": "uint256"
			},
			{
				"indexed": True,
				"internalType": "address",
				"name": "donorAddress",
				"type": "address"
			},
			{
				"indexed": False,
				"internalType": "enum OrganDonation.OrganType",
				"name": "organ",
				"type": "uint8"
			}
		],
		"name": "DonorRegistered",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_donorId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_recipientId",
				"type": "uint256"
			}
		],
		"name": "matchDonor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": False,
		"inputs": [
			{
				"indexed": True,
				"internalType": "uint256",
				"name": "donorId",
				"type": "uint256"
			},
			{
				"indexed": True,
				"internalType": "uint256",
				"name": "recipientId",
				"type": "uint256"
			}
		],
		"name": "Matched",
		"type": "event"
	},
	{
		"anonymous": False,
		"inputs": [
			{
				"indexed": True,
				"internalType": "uint256",
				"name": "recipientId",
				"type": "uint256"
			},
			{
				"indexed": True,
				"internalType": "address",
				"name": "recipientAddress",
				"type": "address"
			},
			{
				"indexed": False,
				"internalType": "enum OrganDonation.OrganType",
				"name": "organNeeded",
				"type": "uint8"
			}
		],
		"name": "RecipientRegistered",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "enum OrganDonation.OrganType",
				"name": "_organ",
				"type": "uint8"
			}
		],
		"name": "registerDonor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum OrganDonation.OrganType",
				"name": "_organNeeded",
				"type": "uint8"
			}
		],
		"name": "registerRecipient",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": False,
		"inputs": [
			{
				"indexed": True,
				"internalType": "uint256",
				"name": "donorId",
				"type": "uint256"
			},
			{
				"indexed": True,
				"internalType": "uint256",
				"name": "recipientId",
				"type": "uint256"
			}
		],
		"name": "Transplanted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "donors",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "donorAddress",
				"type": "address"
			},
			{
				"internalType": "enum OrganDonation.OrganType",
				"name": "organ",
				"type": "uint8"
			},
			{
				"internalType": "enum OrganDonation.DonationStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "donationDate",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_donorId",
				"type": "uint256"
			}
		],
		"name": "getDonor",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "donorAddress",
						"type": "address"
					},
					{
						"internalType": "enum OrganDonation.OrganType",
						"name": "organ",
						"type": "uint8"
					},
					{
						"internalType": "enum OrganDonation.DonationStatus",
						"name": "status",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "donationDate",
						"type": "uint256"
					}
				],
				"internalType": "struct OrganDonation.Donor",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_recipientId",
				"type": "uint256"
			}
		],
		"name": "getRecipient",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "recipientAddress",
						"type": "address"
					},
					{
						"internalType": "enum OrganDonation.OrganType",
						"name": "organNeeded",
						"type": "uint8"
					},
					{
						"internalType": "enum OrganDonation.DonationStatus",
						"name": "status",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "requestDate",
						"type": "uint256"
					}
				],
				"internalType": "struct OrganDonation.Recipient",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "matches",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "recipients",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "recipientAddress",
				"type": "address"
			},
			{
				"internalType": "enum OrganDonation.OrganType",
				"name": "organNeeded",
				"type": "uint8"
			},
			{
				"internalType": "enum OrganDonation.DonationStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "requestDate",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

# Initialize contract
contract = w3.eth.contract(address=contract_address, abi=contract_abi)

# Database connection and initialization
def get_db_connection():
    connection = sqlite3.connect('organ_donation.db')
    return connection

def init_db():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS donors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            donor_address TEXT NOT NULL,
            organ_type INTEGER NOT NULL,
            status INTEGER NOT NULL,
            donation_date INTEGER NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS recipients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            recipient_address TEXT NOT NULL,
            organ_needed INTEGER NOT NULL,
            status INTEGER NOT NULL,
            request_date INTEGER NOT NULL
        )
    ''')
    connection.commit()
    connection.close()

# Initialize the database on app start
init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/add_user', methods=['POST'])
def add_user():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']

        # Insert data into the database
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("INSERT INTO users (name, email) VALUES (?, ?)", (name, email))
        connection.commit()
        connection.close()
        print(name, email)
        
        return redirect(url_for('index'))

@app.route('/list_users', methods=['GET'])
def list_users():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    connection.close()
    
    return render_template('list_users.html', users=users)

@app.route('/register_donor', methods=['POST'])
def register_donor():
    donor_address = request.form['donor_address']
    organ_type = int(request.form['organ_type'])  # Convert to int
    status = 0  # Assuming status is 0 when newly registered
    donation_date = int(w3.eth.get_block('latest')['timestamp'])  # Current timestamp as donation date

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

    # Store the donor information in the database
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO donors (donor_address, organ_type, status, donation_date) VALUES (?, ?, ?, ?)", 
                   (donor_address, organ_type, status, donation_date))
    connection.commit()
    connection.close()

    return render_template('success.html', txn_hash=txn_hash.hex())

@app.route('/get_donor/<int:donor_id>', methods=['GET'])
def get_donor(donor_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM donors WHERE id = ?", (donor_id,))
    donor = cursor.fetchone()
    connection.close()
    
    if donor:
        return jsonify({
            "id": donor[0],
            "donor_address": donor[1],
            "organ": donor[2],
            "status": donor[3],
            "donation_date": donor[4]
        })
    else:
        return jsonify({"error": "Donor not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)
