// Open the relevant tab
function openTab(evt, tabName) {
    let tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
}

// Show the first tab by default
document.getElementsByClassName("tablink")[0].click();

// Read and display the uploaded CSV file
document.getElementById("uploadFile").addEventListener("click", function() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {
        const content = event.target.result;
        const resultsDiv = document.getElementById("results");

        // Split the content by rows, then split each row by commas
        const rows = content.split("\n").map(row => row.split(","));
        
        if (rows.length === 0) {
            alert("CSV file is empty or invalid.");
            return;
        }

        // Assume the first row is the header, and the rest is data
        const headers = rows[0];

        // Arrays to store frequencies of main numbers and Life Ball numbers
        const mainNumbersFreq = Array(47).fill(0); // Main numbers (1-47)
        const lifeBallFreq = Array(10).fill(0); // Life Ball numbers (1-10)

        // Display the data in a table
        let output = "<table><thead><tr>";
        headers.forEach(header => {
            output += `<th>${header}</th>`;
        });
        output += "</tr></thead><tbody>";

        // Process data and frequencies
        rows.slice(1).forEach(row => {
            if (row.length >= 6) { // Ensure each row has enough columns
                output += "<tr>";
                row.forEach(cell => {
                    output += `<td>${cell.trim()}</td>`; // Remove extra spaces
                });

                // Process main numbers and Life Ball number
                for (let i = 1; i <= 5; i++) { // Main numbers are in columns 1-5
                    const mainNum = parseInt(row[i], 10);
                    if (mainNum >= 1 && mainNum <= 47) {
                        mainNumbersFreq[mainNum - 1]++;
                    }
                }

                const lifeBallNum = parseInt(row[5], 10); // Life Ball is in column 6
                if (lifeBallNum >= 1 && lifeBallNum <= 10) {
                    lifeBallFreq[lifeBallNum - 1]++;
                }

                output += "</tr>";
            }
        });

        output += "</tbody></table>";
        resultsDiv.innerHTML = output;

        // Display frequencies of main numbers
        let mainNumbersOutput = "<table><thead><tr><th>Number</th><th>Frequency</th></tr></thead><tbody>";
        for (let i = 0; i < 47; i++) {
            mainNumbersOutput += `<tr><td>${i + 1}</td><td>${mainNumbersFreq[i]}</td></tr>`;
        }
        mainNumbersOutput += "</tbody></table>";
        document.getElementById("mainNumbersFreq").innerHTML = mainNumbersOutput;

        // Display frequencies of Life Ball numbers
        let lifeBallOutput = "<table><thead><tr><th>Life Ball Number</th><th>Frequency</th></tr></thead><tbody>";
        for (let i = 0; i < 10; i++) {
            lifeBallOutput += `<tr><td>${i + 1}</td><td>${lifeBallFreq[i]}</td></tr>`;
        }
        lifeBallOutput += "</tbody></table>";
        document.getElementById("lifeBallFreq").innerHTML = lifeBallOutput;
    };

    reader.readAsText(file);
});

// Generate a fresh set of random numbers (1-47 for main, 1-10 for Life Ball)
function generateRandomNumbers() {
    let mainNumbers = new Set();
    while (mainNumbers.size < 5) {
        mainNumbers.add(Math.floor(Math.random() * 47) + 1);
    }
    let lifeBall = Math.floor(Math.random() * 10) + 1; // Random Life Ball number
    return { mainNumbers: [...mainNumbers], lifeBall };
}

// Generate suggestions on button click
document.getElementById("suggestNumbers").addEventListener("click", function() {
    let { mainNumbers, lifeBall } = generateRandomNumbers();
    document.getElementById("suggestionResult").innerText = "Suggested Main Numbers: " + mainNumbers.join(", ") + " | Suggested Life Ball: " + lifeBall;
});

// Generate combinations based on selected count (2, 3, 4, or 5 numbers)
document.getElementById("generateCombinations").addEventListener("click", function() {
    let comboCount = parseInt(document.getElementById("comboCount").value);
    let combinations = [];
    for (let i = 0; i < 5; i++) {
        let numbers = new Set();
        while (numbers.size < comboCount) {
            numbers.add(Math.floor(Math.random() * 47) + 1);
        }
        combinations.push([...numbers].join(", "));
    }
    document.getElementById("combinationsResult").innerText = "Combinations:\n" + combinations.join("\n");
});

// Calculate the probability for the entered number (1-47 for main numbers)
document.getElementById("calculateProbability").addEventListener("click", function() {
    let inputNumber = parseInt(document.getElementById("inputNumber").value);
    if (inputNumber >= 1 && inputNumber <= 47) {
        let probability = Math.floor(Math.random() * 100) + 1; // Random mock probability
        document.getElementById("probabilityResult").innerText = `Probability of ${inputNumber}: ${probability}%`;
    } else {
        document.getElementById("probabilityResult").innerText = "Please enter a valid number between 1 and 47.";
    }
});
