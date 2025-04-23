var timeVal;

var shouldTransition;

var previousTimeVal;

var isVanishing;

var meetingBase64;

const base64imagelist = [];


document.addEventListener('DOMContentLoaded', function() {



    SetInitialState('before-goals', '1-1', true);
    SetInitialState('before-progress', '1-2', true);
    SetInitialState('before-plans', '1-3', true);
    SetInitialState('before-browser', '1-4', true);

    SetInitialState('after-goals', '2-1', true);
    SetInitialState('after-progress', '2-2', false);
    SetInitialState('after-plans', '2-3', false);
    SetInitialState('after-browser', '2-4', false);
    

    isVanishing = false;

    timeVal = 0;

    previousTimeVal = 0;
    UpdateRecap();

    document.body.setAttribute('spellcheck', false);

    const slidertime = document.getElementById('slider-time');


    slidertime.addEventListener('input', function() {
        timeVal = slidertime.value;
    });


    slidertime.addEventListener('change', function() {
        UpdateRecap();
    });

    GetFiles();




});

function SetInitialState(parent, content, state)
{
    const thisParent = document.getElementById(parent);
    const thisContent = document.getElementById(content);

    if(!state)
    {
        thisContent.style.display = 'none';
        thisParent.style.width = '0px';
        thisParent.style.height = '0px';
        thisContent.style.opacity = '0';

    }

}

function HandleState(parent, content, state, isLong = false) {

    if(state)
    {
        setTimeout(function() {LateHandleAppear(parent, content, state, isLong);}, 550);        
    }
    else{

        //console.log("Handling state for: " + parent);

    const thisParent = document.getElementById(parent);
    const thisContent = document.getElementById(content);

    if( window.getComputedStyle(thisContent, null).display == 'block' && state == false)
    {
        console.log("Vanishing " + parent);
        // Vanish text
        isVanishing = true;
        thisContent.style.opacity = '0';
        setTimeout(function() {Disappear(parent, content, state);}, 550);
    }

    }    
}

function LateHandleAppear(parent, content, state, isLong = false)
{

    const thisParent = document.getElementById(parent);
    const thisContent = document.getElementById(content);

    if(window.getComputedStyle(thisContent, null).display == 'none' && state == true)
        {
            console.log("Displaying " + parent);
            // Grow size
            if(isVanishing)
            {
                LateAppear(parent, content, state, isLong);
            }
            else{
                thisParent.style.width = isLong ?  '1160px' : '380px';
                thisParent.style.height = isLong ?  '300px' : '220px';
                thisContent.style.display = 'block';
                setTimeout(function() {Reappear(parent, content, state);}, 550);
            }
            
        }
}

function LateAppear(parent, content, state, isLong = false)
{
    const thisParent = document.getElementById(parent);
    const thisContent = document.getElementById(content);
    thisParent.style.width = isLong ?  '1160px' : '380px';
    thisParent.style.height = isLong ?  '300px' : '220px';
            thisContent.style.display = 'block';
            setTimeout(function() {Reappear(parent, content, state);}, 550);

}

function Disappear(parent, content, state)
{
    const thisParent = document.getElementById(parent);
    const thisContent = document.getElementById(content);

    thisContent.style.display = 'none';
    thisParent.style.width = '0px';
    thisParent.style.height = '0px';
    isVanishing = false;

}

function Reappear(parent, content, state)
{

    const thisParent = document.getElementById(parent);
    const thisContent = document.getElementById(content);

    thisContent.style.display = 'block';

    thisContent.style.opacity = '1';

}

function UpdateRecap() {

    HandleState('before-goals', '1-1', (timeVal <=100));
    HandleState('before-progress', '1-2', (timeVal <= 70 ));
    HandleState('before-plans', '1-3', (timeVal <= 50 ));
    HandleState('before-browser', '1-4', (timeVal <= 20 ), true);

    HandleState('after-goals', '2-1', (timeVal >=0));
    HandleState('after-progress', '2-2', (timeVal >= 20 ));
    HandleState('after-plans', '2-3', (timeVal >= 50 ));
    HandleState('after-browser', '2-4', (timeVal >= 70 ), true);


}


fetch('meeting-new.txt')
    .then(response => response.text())
    .then(text => {
        meetingBase64 = text.split('\n');           
    })
    .catch(error => console.error('Error fetching the file:', error));


function GetFiles()
{
    const fileDetails = [
        { name: 'meeting1.txt', type: 'text' },
        { name: 'meetingA.txt', type: 'text' },
        { name: 'before.json', type: 'json' },
        { name: 'after.json', type: 'json' }
    ];

    const filePromises = fileDetails.map(fileDetail => {
        return fetch(fileDetail.name)
            .then(response => {
                if (fileDetail.type === 'text') {
                    return response.text();
                } else if (fileDetail.type === 'json') {
                    return response.json();
                }
            });
    });

    Promise.all(filePromises)
        .then(fileContents => {
            fileContents.forEach((data, index) => {
                if (fileDetails[index].type === 'text') {
                    const lines = data.split('\n');
                    //meetingBase64 = lines;
                    base64imagelist.push(lines);
                    // console.log(`Contents of ${fileDetails[index].name}:`, lines); // Array of lines for the text file
                } else if (fileDetails[index].type === 'json') {
                    if(fileDetails[index].name === 'before.json')
                    {

                            document.getElementById('before-title').innerText = data.title;
                            // document.getElementById('before-details').innerText = `${data.date} - ${data.time}`;

                            const goalsList = document.getElementById('before-goals-list');

                            data.goals.forEach((goal, index) => {
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
                            data.progress.forEach(item => {
                                const li = document.createElement('li');
                                li.className = 'content-editable';
                                li.contentEditable = true;
                                li.innerText = item;
                                progress.appendChild(li);
                            });

                            const plans = document.getElementById('before-plans-list');
                            data.plans.forEach(item => {
                                const li = document.createElement('li');
                                li.className = 'content-editable';
                                li.contentEditable = true;
                                li.innerText = item;
                                plans.appendChild(li);
                            });


                            //var test = meetingBase64;
                            var test = base64imagelist[0];

                            const highlights = document.getElementById('1-4');
                            data.highlights.forEach(item => {
                                const imageHighlight = document.createElement('img');
                                imageHighlight.title = item.title;
                                imageHighlight.src = 'data:image/jpg;base64,' + test[parseInt(item.src)];
                                highlights.append(imageHighlight);
                            });
                    }
                    else
                    if(fileDetails[index].name === 'after.json')
                    {

                        document.getElementById('after-title').innerText = data.title;
                        // document.getElementById('after-details').innerText = `${data.date} - ${data.time}`;

                        const goalsList = document.getElementById('after-goals-list');
                        data.goals.forEach((goal, index) => {
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

                        const progress = document.getElementById('after-progress-list');
                        data.progress.forEach(item => {
                            const li = document.createElement('li');
                            li.className = 'content-editable';
                            li.contentEditable = true;
                            li.innerText = item;
                            progress.appendChild(li);
                        });

                        const plans = document.getElementById('after-plans-list');
                        data.plans.forEach(item => {
                            const li = document.createElement('li');
                            li.className = 'content-editable';
                            li.contentEditable = true;
                            li.innerText = item;
                            plans.appendChild(li);
                        });

                        //var test = meetingBase64;
                        var test = base64imagelist[1];

                            const highlights = document.getElementById('2-4');
                            data.highlights.forEach(item => {
                                const imageHighlight = document.createElement('img');
                                imageHighlight.title = item.title;
                                imageHighlight.src = 'data:image/jpg;base64,' + test[parseInt(item.src)];
                                highlights.append(imageHighlight);
                            });

                        

                    }
                }
            });
        })
        .catch(error => console.error('Error fetching the files:', error));
}
