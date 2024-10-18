
function toggleMenu() {
    const menuItems = document.getElementById("menuItems");
    if (menuItems.style.display === "block") {
        menuItems.style.display = "none"; // Hide menu
    } else {
        menuItems.style.display = "block"; // Show menu
    }
}





let donationCount = 0; // Initial donation count
let waitingListCount = 0; // Initial waiting list count

// Function to update counters
function updateCounters() {
    donationCount++; // Increment donation count
    waitingListCount++; // Increment waiting list count

    // Update the HTML content
    document.getElementById('donationCount').textContent = donationCount*3;
    document.getElementById('waitingListCount').textContent = waitingListCount;
}

// Set interval for updating the counters (change the value 1000 to your desired interval in milliseconds)
setInterval(updateCounters, 9000); // Update every second (1000 ms)


// JavaScript to open another HTML file in a new tab
document.getElementById('openPageBtn').addEventListener('click', function() {
    window.open('formd1.html', '_blank'); // 'newpage.html' is the file you want to open
});

document.getElementById('openPageBtn1').addEventListener('click', function() {
    window.open('rform.html', '_blank'); // 'newpage.html' is the file you want to open
});

document.getElementById('openPageBtn2').addEventListener('click', function() {
    window.open('formd2.html', '_blank'); // 'newpage.html' is the file you want to open
});

document.getElementById('serviceBtn1').addEventListener('click', function() {
    window.open('service1.html', '_blank'); // Replace with your service page URL
});

document.getElementById('serviceBtn2').addEventListener('click', function() {
    window.open('service2.html', '_blank'); // Replace with your service page URL
});

document.getElementById('serviceBtn3').addEventListener('click', function() {
    window.open('service3.html', '_blank'); // Replace with your service page URL
});
