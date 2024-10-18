// Existing JavaScript code remains the same

// Add this new code for the live count functionality
function updateLiveCounts() {
    const donationCount = document.getElementById('donation-count');
    const waitingCount = document.getElementById('waiting-count');

    // Simulating live data with random increments
    setInterval(() => {
        let currentDonations = parseInt(donationCount.textContent);
        let currentWaiting = parseInt(waitingCount.textContent);

        // Randomly increment donations (less frequently)
        if (Math.random() < 0.4) {
            currentDonations += Math.floor(Math.random() * 3) + 1;
            donationCount.textContent = currentDonations;
        }

        // Randomly increment waiting (more frequently)
        if (Math.random() < 0.7) {
            currentWaiting += Math.floor(Math.random() * 5) + 1;
            waitingCount.textContent = currentWaiting;
        }
    }, 10000); // Update every 2 seconds
}
document.addEventListener('DOMContentLoaded', updateLiveCounts);
function openForm(formId) {
    document.getElementById(formId).style.display = "block";
}

function closeForm(formId) {
    document.getElementById(formId).style.display = "none";
}

// Add form submission handling
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('.form-container');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const formObject = Object.fromEntries(formData.entries());
            console.log('Form submitted:', formObject);
            
            // Here you would typically send this data to a server
            // For now, we'll just update the counts and close the form
            if (form.id === 'donor-form') {
                const donationCount = document.getElementById('donation-count');
                donationCount.textContent = parseInt(donationCount.textContent) + 1;
            } else if (form.id === 'recipient-form') {
                const waitingCount = document.getElementById('waiting-count');
                waitingCount.textContent = parseInt(waitingCount.textContent) + 1;
            }
            
            closeForm(form.parentElement.id);
            form.reset();
            alert('Thank you for your submission!');
        });
    });
});

// Initialize web3
if (typeof window.ethereum !== 'undefined') {
    // Use MetaMask's provider
    web3 = new Web3(window.ethereum);
    // Request account access
    window.ethereum.request({ method: 'eth_requestAccounts' });
} else {
    alert("Please install MetaMask to use this feature.");
}

// Contract setup
const contractAddress = "0x6BCfF76B730214C805e863A2Ad28CC308393E739";
const contractABI = [
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
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "donorId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "recipientId",
				"type": "uint256"
			}
		],
		"name": "DonationCompleted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "donorId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "donorAddress",
				"type": "address"
			},
			{
				"indexed": false,
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
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "donorId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "recipientId",
				"type": "uint256"
			}
		],
		"name": "Matched",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "recipientId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "recipientAddress",
				"type": "address"
			},
			{
				"indexed": false,
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
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "donorId",
				"type": "uint256"
			},
			{
				"indexed": true,
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
]; // Paste the ABI array here
const organDonationContract = new web3.eth.Contract(contractABI, contractAddress);

// Form submission handler
async function handleFormSubmission(formObject, formType) {
    const accounts = await web3.eth.getAccounts();
    const userAccount = accounts[0];

    if (formType === 'donor') {
        // Register a donor on the blockchain
        await organDonationContract.methods.registerDonor(
            formObject["donor-name"],
            formObject["donor-email"],
            formObject["donor-age"],
            formObject["donor-blood-type"]
        ).send({ from: userAccount });
        alert('Donor registered successfully on the blockchain');
    } else if (formType === 'recipient') {
        // Register a recipient on the blockchain
        await organDonationContract.methods.registerRecipient(
            formObject["recipient-name"],
            formObject["recipient-email"],
            formObject["recipient-age"],
            formObject["recipient-blood-type"],
            formObject["recipient-organ"]
        ).send({ from: userAccount });
        alert('Recipient registered successfully on the blockchain');
    }
}

// Add the form submission handling
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('.form-container');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const formObject = Object.fromEntries(formData.entries());
            const formType = form.id === 'donor-form' ? 'donor' : 'recipient';
            handleFormSubmission(formObject, formType);
            closeForm(form.parentElement.id);
            form.reset();
        });
    });
});


// Call the function when the page loads
document.addEventListener('DOMContentLoaded', updateLiveCounts);