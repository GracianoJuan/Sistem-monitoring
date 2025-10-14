import axios from 'axios';


const getA = async () => {
    let a = await axios.get('http://127.0.0.1:8000/api/stats');
    return a.data;
}
let a = new Promise((resolve, reject) => {
    getA().then(data => {
        resolve(data);
        console.log(data);
    }
    ).catch(error => {
        reject(error);
    });
});
// let labels = a.data.progress_pengadaan.map(item => item.value);


// make a promise to fetch data from the API
// a.then(data => {
//     let labels = data.progress_pengadaan.map(item => item.value);
//     console.log(labels);
// });

// promise example
