const { db } = require('../utils/admin');
const { response, request } = require('express');

exports.getAll = (request, response) => {

    db
        .collection('sirius-all')
        .orderBy('name', 'asc')
        .get()
        .then((data) => {
            let allCandidates = [];
            data.forEach(ele => {
                allCandidates.push({
                    id: ele.id,
                    name: ele.data().name,
                    mode: ele.data().mode
                });
            });
            return response.json(allCandidates);
        })
        .catch(err => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        })
}

exports.getStandupCan = (request, response) => {

    db
        .collection('sirius-standup')
        .orderBy('name', 'asc')
        .get()
        .then((data) => {
            let candidates = [];
            data.forEach(ele => {
                candidates.push({
                    id: ele.id,
                    name: ele.data().name,
                    mode: ele.data().mode
                });
            });
            return response.json(candidates);
        })
        .catch(err => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        })
}

exports.getRetroCan = (request, response) => {

    db
        .collection('sirius-retro')
        .orderBy('name', 'asc')
        .get()
        .then((data) => {
            let candidates = [];
            data.forEach(ele => {
                candidates.push({
                    id: ele.id,
                    name: ele.data().name,
                    mode: ele.data().mode
                });
            });
            return response.json(candidates);
        })
        .catch(err => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        })
}

exports.getSprintPlanCan = (request, response) => {

    db
        .collection('sirius-sprintplan')
        .orderBy('name', 'asc')
        .get()
        .then((data) => {
            let candidates = [];
            data.forEach(ele => {
                candidates.push({
                    id: ele.id,
                    name: ele.data().name,
                    mode: ele.data().mode
                });
            });
            return response.json(candidates);
        })
        .catch(err => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        })
}

exports.addNew = (request, response) => {

    addMethod(request, response, 'sirius-all', 'all');
}

exports.addNewStandupCan = (request, response) => {

    addMethod(request, response, 'sirius-standup', 'standup');

}

exports.addNewRetroCan = (request, response) => {

    addMethod(request, response, 'sirius-retro', 'retro');

}

exports.addNewSprintplanCan = (request, response) => {

    addMethod(request, response, 'sirius-sprintplan', 'plan');

}

exports.deleteStandupCan = (request, response) => {
    deleteMethod(request, response, 'sirius-standup')
}

exports.deleteRretroCan = (request, response) => {
    deleteMethod(request, response, 'sirius-retro')
}

exports.deleteSprintplanCan = (request, response) => {
    deleteMethod(request, response, 'sirius-sprintplan')
}

exports.deleteCan = (request, response) => {
    deleteMethod(request, response, 'sirius-all')
}

const addMethod = (request, response, collection, mode) => {
    if (request.body.name.trim() === '') {
        return response.status(400).json({ name: 'Must not be empty' })
    }
    const newCandidate = {
        name: request.body.name,
        mode: mode,
        time: new Date()
    }
    db
        .collection(collection)
        .add(newCandidate)
        .then((doc) => {
            const responseNewCandidate = newCandidate;
            responseNewCandidate.id = doc.id;
            return response.json(responseNewCandidate);
        })
        .catch((err) => {
            response.status(500).json({ error: err });
            console.error(err);
        });
}

const deleteMethod = (request, response, collection) => {
    const document = db.doc(`/${collection}/${request.params.id}`);
    document
        .get()
        .then(doc => {
            if (!doc.exists) {
                return response.status(404).json({ error: 'candidate not found' })
            }
            document.delete();
        })
        .then(() => {
            response.json({ message: 'Delete successfully' })
        })
        .catch(err => {
            console.log(err);
            return response.status(500).json({ err: err.code });
        })
}