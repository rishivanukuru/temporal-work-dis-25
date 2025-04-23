const timelineContent = document.querySelector('.timeline-content');
const timelineSections = document.querySelectorAll('.timeline-section');
const scrollbar = document.querySelector('.scrollbar');
const scrollbarHandle = document.querySelector('.scrollbar-handle');
const topHandle = document.querySelector('.resize-handle.top');
const timeWindow = document.querySelector('.time-window')

// const title = document.getElementById('title');
// const details = document.getElementById('before-details');
// const goalsList = document.getElementById('before-goals-list');
// const progress = document.getElementById('before-progress-list');

// const highlights = document.getElementById('image-highlights');

const JSONObjects = [];
var base64imagelist = [];

let isResizing = false;
let isDragging = false;
let startY;
let startHeight;
let startTop;

var meetingBase64;


// Constants for handle dimensions as percentages of the scrollbar height
const INITIAL_HANDLE_HEIGHT_PERCENT = 25; // Initial handle height in percentage
const MIN_HANDLE_HEIGHT_PERCENT = 25; // Minimum handle height in percentage
const MAX_HANDLE_HEIGHT_PERCENT = 100; // Maximum handle height in percentage

// Initialize the scrollbar handle at its lowest position with the default height
function initializeScrollbar() {
    const scrollbarHeight = scrollbar.offsetHeight;

    // Set the initial height and position of the handle
    const initialHeight = (INITIAL_HANDLE_HEIGHT_PERCENT / 100) * scrollbarHeight;
    scrollbarHandle.style.height = `${(initialHeight / scrollbarHeight) * 100}%`;
    scrollbarHandle.style.top = `${100 - (initialHeight / scrollbarHeight) * 100}%`;

    // timelineSections.forEach((section, index) => {
    //     if (index == 3) {
    //         section.style.display = 'flex';
    //     } else {
    //         section.style.display = 'none';
    //     }
    // });

    // console.log(document.getElementById("title"));

    
}

// Resize the handle
function onResize(event) {
    if (!isResizing) return;

    const deltaY = event.clientY - startY;
    const scrollbarHeight = scrollbar.offsetHeight;

    const newTop = Math.min(
        Math.max(startTop + deltaY / scrollbarHeight * 100, 0),
        100 - (startHeight / scrollbarHeight) * 100
    );
    const newHeight = startHeight - deltaY;

    const minHeight = (MIN_HANDLE_HEIGHT_PERCENT / 100) * scrollbarHeight;
    const maxHeight = (MAX_HANDLE_HEIGHT_PERCENT / 100) * scrollbarHeight;

    if (newHeight >= minHeight && newHeight <= maxHeight) {
        scrollbarHandle.style.top = `${newTop}%`;
        scrollbarHandle.style.height = `${(newHeight / scrollbarHeight) * 100}%`;
    }
}

// Start resizing
function onResizeStart(event) {
    isResizing = true;
    startY = event.clientY;
    startHeight = scrollbarHandle.offsetHeight;
    startTop = parseFloat(scrollbarHandle.style.top || 0) / 100 * scrollbar.offsetHeight;
    document.body.style.userSelect = 'none';
}

// Stop resizing
function onResizeEnd() {
    if (isResizing) {
        updateVisibleSections(); // Update sections only after resizing ends
    }
    isResizing = false;
    document.body.style.userSelect = '';
}

// Dragging the handle
function onDrag(event) {
    if (!isDragging) return;

    const deltaY = event.clientY - startY;
    const scrollbarHeight = scrollbar.offsetHeight;
    const handleHeight = scrollbarHandle.offsetHeight / scrollbarHeight * 100;

    if (handleHeight < 30) {
        timeWindow.innerHTML = "Browsing in increments <br> of 1 meeting."
    }
    else
        if (handleHeight < 55) {
            timeWindow.innerHTML = "Browsing in increments <br> of 2 meetings."
        }
        else
            if (handleHeight < 80) {
                timeWindow.innerHTML = "Browsing in increments <br> of 3 meetings."
            }
            else {
                timeWindow.innerHTML = "Browsing in increments <br> of 4 meetings."
            }

    const newTop = Math.min(
        Math.max(startTop + (deltaY / scrollbarHeight) * 100, 0),
        100 - handleHeight
    );
    scrollbarHandle.style.top = `${newTop}%`;
}

// Start dragging
function onDragStart(event) {
    isDragging = true;
    startY = event.clientY;
    startTop = parseFloat(scrollbarHandle.style.top || 0);
    document.body.style.userSelect = 'none';
}

// Stop dragging
function onDragEnd() {
    if (isDragging) {
        updateVisibleSections(); // Update sections only after dragging ends
    }
    isDragging = false;
    document.body.style.userSelect = '';
}

// Sync visible sections based on scrollbar position and size
function updateVisibleSections() {
    const handleTop = parseFloat(scrollbarHandle.style.top || 0);
    const handleHeight = scrollbarHandle.offsetHeight / scrollbar.offsetHeight * 100;
    const maxScroll = timelineContent.scrollHeight - timelineContent.offsetHeight;

    //const visibleStart = (handleTop / 100) * timelineSections.length;
    //const visibleEnd = ((handleTop + handleHeight) / 100) * timelineSections.length;

    
    // console.log("handleHeight:" + handleHeight.toString());
    // console.log("handlePos:" + (handleTop).toString());
    // console.log("scrollLength:" + (timelineContent.scrollHeight).toString());

        if (handleHeight < 30) {
        if(handleTop <= 20)
        {
            activeIndex = 1;
        }
        else
        if(handleTop <= 45)
            {
                activeIndex = 2;

            }
            else        
            if(handleTop <=70)
                {
                    activeIndex = 3;

                }
                else{
                    activeIndex = 4;

                }
    }
    else
        if (handleHeight < 55) {
            if(handleTop <=12.5)
                {
                    activeIndex = 5;
                }
                else
                if(handleTop <=37.5)
                    {
                        activeIndex = 6;
        
                    }
                    else        
                        {
                            activeIndex = 7;
        
                        }
        }
        else
            if (handleHeight < 80) 
                
                {
                    if(handleTop <=20)
                        {
                            activeIndex = 8;
                        }
                            else        
                                {
                                    activeIndex = 9;
                
                                }
            }
            else {
                activeIndex = 10;
            }

            activeIndex--;
            // console.log("activeIndex:" + (activeIndex).toString());
            SetContent(activeIndex);
            // console.log(JSONObjects[activeIndex].title);
            // console.log(document.getElementById("title"));


            


        // timelineSections.forEach((section, index) => {
        //         if (index == activeIndex - 1) {
        //             section.style.display = 'flex';
        //         } else {
        //             section.style.display = 'none';
        //         }
        //     });

    // timelineSections.forEach((section, index) => {
    //     if (index >= visibleStart && index < visibleEnd) {
    //         section.style.display = 'flex';
    //     } else {
    //         section.style.display = 'none';
    //     }
    // });
}

function SetContent(index) {
    //index = (int)index1;
    document.getElementById("title").innerText = JSONObjects[index].title;
    //document.getElementById("details").innerText = `${JSONObjects[index].date} - ${JSONObjects[index].time}`;


    var detailText = "";

    switch (index) {
        case 0:
            detailText = "Meeting 1";
            break;
        case 1:
            detailText = "Meeting 2";
            break;
        case 2:
            detailText = "Meeting 3";
            break;
        case 3:
            detailText = "Meeting 4";
            break;
        case 4:
            detailText = "Meeting 1 & 2";
            break;
        case 5:
            detailText = "Meeting 2 & 3";
            break;
        case 6:
            detailText = "Meeting 3 & 4";
            break;
        case 7:
            detailText = "Meeting 1, 2 & 3";
            break;
        case 8:
            detailText = "Meeting 2, 3 & 4";
            break;
        case 9:
            detailText = "Meeting 1, 2, 3 & 4";
            break;
        default:
            detailText = "Meeting Overview";
            break;
    }

    document.getElementById("details").innerText = detailText;

    const goalsList = document.getElementById("before-goals-list");

    while (goalsList.firstChild) {
        goalsList.removeChild(goalsList.lastChild);
    }

    JSONObjects[index].goals.forEach((goal, index) => {
        const goalItem = document.createElement('div');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `goal-${index}`;
        const label = document.createElement('label');
        label.htmlFor = `goal-${index}`;
        label.className = 'content-editable';
        label.contentEditable = true;
        label.innerText = goal;

        goalItem.appendChild(checkbox);
        goalItem.appendChild(label);
        goalsList.appendChild(goalItem);
    });

    const progress = document.getElementById('before-progress-list');

    while (progress.firstChild) {
        progress.removeChild(progress.lastChild);
    }

    JSONObjects[index].progress.forEach(item => {
        const li = document.createElement('li');
        li.className = 'content-editable';
        li.contentEditable = true;
        li.innerText = item;
        progress.appendChild(li);
    });

    const plans = document.getElementById("before-plans-list");

    while (plans.firstChild) {
        plans.removeChild(plans.lastChild);
    }

    JSONObjects[index].plans.forEach(item => {
        const li = document.createElement('li');
        li.className = 'content-editable';
        li.contentEditable = true;
        li.innerText = item;
        plans.appendChild(li);
    });


    // const plans = document.getElementById('before-plans-list');
    // JSONObjects[activeIndex].plans.forEach(item => {
    //     const li = document.createElement('li');
    //     li.className = 'content-editable';
    //     li.contentEditable = true;
    //     li.innerText = item;
    //     plans.appendChild(li);
    // });


    var test = base64imagelist[index];

    const highlights = document.getElementById('image-highlights');

    while (highlights.firstChild) {
        highlights.removeChild(highlights.lastChild);
    }

    JSONObjects[index].highlights.forEach(item => {
        const imageHighlight = document.createElement('img');
        imageHighlight.title = item.title;
        imageHighlight.src = 'data:image/jpg;base64,' + test[parseInt(item.src)];
        highlights.append(imageHighlight);
    });
}

// Event listeners
topHandle.addEventListener('mousedown', onResizeStart);
document.addEventListener('mousemove', onResize);
document.addEventListener('mouseup', onResizeEnd);

scrollbarHandle.addEventListener('mousedown', onDragStart);
document.addEventListener('mousemove', onDrag);
document.addEventListener('mouseup', onDragEnd);

// Initialize the scrollbar on page load
window.onload = initializeScrollbar;

GetFiles();

function GetFiles() {
    const fileDetails = [
        { name: 'meeting1.txt', type: 'text' },
        { name: 'meeting2.txt', type: 'text' },
        { name: 'meeting3.txt', type: 'text' },
        { name: 'meeting4.txt', type: 'text' },
        { name: 'meeting5.txt', type: 'text' },
        { name: 'meeting6.txt', type: 'text' },
        { name: 'meeting7.txt', type: 'text' },
        { name: 'meeting8.txt', type: 'text' },
        { name: 'meeting9.txt', type: 'text' },
        { name: 'meeting10.txt', type: 'text' },
        { name: 'meeting1.json', type: 'json' },
        { name: 'meeting2.json', type: 'json' },
        { name: 'meeting3.json', type: 'json' },
        { name: 'meeting4.json', type: 'json' },
        { name: 'meeting5.json', type: 'json' },
        { name: 'meeting6.json', type: 'json' },
        { name: 'meeting7.json', type: 'json' },
        { name: 'meeting8.json', type: 'json' },
        { name: 'meeting9.json', type: 'json' },
        { name: 'meeting10.json', type: 'json' }
    ];

    // Array to store JSON objects
    // const JSONObjects = [];
    // meetingBase64 = null; // Variable to store text file content

    const filePromises = fileDetails.map(fileDetail => {
        return fetch(fileDetail.name)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${fileDetail.name}`);
                }
                return fileDetail.type === 'text' ? response.text() : response.json();
            });
    });

    Promise.all(filePromises)
        .then(fileContents => {
            fileContents.forEach((data, index) => {
                if (fileDetails[index].type === 'text') {
                    var lines = data.split('\n');
                    // meetingBase64 = lines; // Store the text file's lines
                    base64imagelist.push(lines);
                } else if (fileDetails[index].type === 'json') {
                    JSONObjects.push(data); // Add the JSON object to the array
                }
            });

            // Log the results
            // console.log('Text file content:', meetingBase64);
            // console.log('JSON files:', JSONObjects);

            SetContent(3);
        })
        .catch(error => console.error('Error fetching the files:', error));



}


// const timelineContent = document.querySelector('.timeline-content');
// const timelineSections = document.querySelectorAll('.timeline-section');
// const scrollbar = document.querySelector('.scrollbar');
// const scrollbarHandle = document.querySelector('.scrollbar-handle');
// const topHandle = document.querySelector('.resize-handle.top');
// const timeWindow = document.querySelector('.time-window')

// let isResizing = false;
// let isDragging = false;
// let startY;
// let startHeight;
// let startTop;

// // Constants for handle dimensions as percentages of the scrollbar height
// const INITIAL_HANDLE_HEIGHT_PERCENT = 25; // Initial handle height in percentage
// const MIN_HANDLE_HEIGHT_PERCENT = 25; // Minimum handle height in percentage
// const MAX_HANDLE_HEIGHT_PERCENT = 100; // Maximum handle height in percentage

// // Initialize the scrollbar handle at its lowest position with the default height
// function initializeScrollbar() {
//     const scrollbarHeight = scrollbar.offsetHeight;

//     // Set the initial height and position of the handle
//     const initialHeight = (INITIAL_HANDLE_HEIGHT_PERCENT / 100) * scrollbarHeight;
//     scrollbarHandle.style.height = `${(initialHeight / scrollbarHeight) * 100}%`;
//     scrollbarHandle.style.top = `${100 - (initialHeight / scrollbarHeight) * 100}%`;
// }

// // Resize the handle
// function onResize(event) {
//     if (!isResizing) return;

//     const deltaY = event.clientY - startY;
//     const scrollbarHeight = scrollbar.offsetHeight;

//     const newTop = Math.min(
//         Math.max(startTop + deltaY / scrollbarHeight * 100, 0),
//         100 - (startHeight / scrollbarHeight) * 100
//     );
//     const newHeight = startHeight - deltaY;

//     const minHeight = (MIN_HANDLE_HEIGHT_PERCENT / 100) * scrollbarHeight;
//     const maxHeight = (MAX_HANDLE_HEIGHT_PERCENT / 100) * scrollbarHeight;

//     if (newHeight >= minHeight && newHeight <= maxHeight) {
//         scrollbarHandle.style.top = `${newTop}%`;
//         scrollbarHandle.style.height = `${(newHeight / scrollbarHeight) * 100}%`;
//     }
// }

// // Start resizing
// function onResizeStart(event) {
//     isResizing = true;
//     startY = event.clientY;
//     startHeight = scrollbarHandle.offsetHeight;
//     startTop = parseFloat(scrollbarHandle.style.top || 0) / 100 * scrollbar.offsetHeight;
//     document.body.style.userSelect = 'none';
// }

// // Stop resizing
// function onResizeEnd() {
//     if (isResizing) {
//         updateVisibleSections(); // Update sections only after resizing ends
//     }
//     isResizing = false;
//     document.body.style.userSelect = '';
// }

// // Dragging the handle
// function onDrag(event) {
//     if (!isDragging) return;

//     const deltaY = event.clientY - startY;
//     const scrollbarHeight = scrollbar.offsetHeight;
//     const handleHeight = scrollbarHandle.offsetHeight / scrollbarHeight * 100;

//     if (handleHeight < 30) {
//         timeWindow.innerHTML = "Browsing in increments <br> of 1 meeting."
//     }
//     else
//         if (handleHeight < 55) {
//             timeWindow.innerHTML = "Browsing in increments <br> of 2 meetings."
//         }
//         else
//             if (handleHeight < 80) {
//                 timeWindow.innerHTML = "Browsing in increments <br> of 3 meetings."
//             }
//             else {
//                 timeWindow.innerHTML = "Browsing in increments <br> of 4 meetings."
//             }

//     const newTop = Math.min(
//         Math.max(startTop + (deltaY / scrollbarHeight) * 100, 0),
//         100 - handleHeight
//     );
//     scrollbarHandle.style.top = `${newTop}%`;
// }

// // Start dragging
// function onDragStart(event) {
//     isDragging = true;
//     startY = event.clientY;
//     startTop = parseFloat(scrollbarHandle.style.top || 0);
//     document.body.style.userSelect = 'none';
// }

// // Stop dragging
// function onDragEnd() {

//     if (isDragging) {
//         updateVisibleSections(); // Update sections only after dragging ends
//     }
//     isDragging = false;
//     document.body.style.userSelect = '';
// }

// // Sync visible sections based on scrollbar position and size
// function updateVisibleSections() {

//     const handleTop = parseFloat(scrollbarHandle.style.top || 0);
//     const handleHeight = scrollbarHandle.offsetHeight / scrollbar.offsetHeight * 100;
//     const maxScroll = timelineContent.scrollHeight - timelineContent.offsetHeight;

//     const visibleStart = (handleTop / 100) * timelineSections.length;
//     const visibleEnd = ((handleTop + handleHeight) / 100) * timelineSections.length;

//     const activeIndex = 11;

//     timelineSections.forEach((section, index) => {
//         if (index >= visibleStart && index < visibleEnd) {
//             section.style.display = 'flex';
//         } else {
//             section.style.display = 'none';
//         }
//     });

//     if (handleHeight < 30) {
//         if(handleTop <=0.20)
//         {
//             activeIndex = 11;
//         }
//         else
//         if(handleTop <=0.45)
//             {
//                 activeIndex = 12;

//             }
//             else        
//             if(handleTop <=0.7)
//                 {
//                     activeIndex = 13;

//                 }
//                 else{
//                     activeIndex = 14;

//                 }
//     }
//     else
//         if (handleHeight < 55) {
//             if(handleTop <=0.125)
//                 {
//                     activeIndex = 21;
//                 }
//                 else
//                 if(handleTop <=0.375)
//                     {
//                         activeIndex = 22;
        
//                     }
//                     else        
//                         {
//                             activeIndex = 23;
        
//                         }
//         }
//         else
//             if (handleHeight < 80) 
                
//                 {
//                     if(handleTop <=0.2)
//                         {
//                             activeIndex = 31;
//                         }
//                             else        
//                                 {
//                                     activeIndex = 32;
                
//                                 }
//             }
//             else {
//                 activeIndex = 41;
//             }

//         // timelineSections.forEach((section, index) => {
//         //         if (index == activeIndex) {
//         //             section.style.display = 'flex';
//         //         } else {
//         //             section.style.display = 'none';
//         //         }
//         //     });
// }

// // Event listeners
// topHandle.addEventListener('mousedown', onResizeStart);
// document.addEventListener('mousemove', onResize);
// document.addEventListener('mouseup', onResizeEnd);

// scrollbarHandle.addEventListener('mousedown', onDragStart);
// document.addEventListener('mousemove', onDrag);
// document.addEventListener('mouseup', onDragEnd);

// // Initialize the scrollbar on page load
// window.onload = initializeScrollbar;
