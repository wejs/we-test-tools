var crypto = require('crypto');
var Chancejs = require('chance');
// Instantiate Chance so it can be used
var chancejs = new Chancejs();

var stubs = {};

stubs.getImageFilePath = function getImageFilePath() {
  return __dirname + '/image.png';
}

stubs.userStub = function userStub() {
  var randString = crypto.randomBytes(20).toString('hex');
  return {
    displayName: chancejs.name(),
    username: randString.slice(0,15),
    fullName: chancejs.name(),
    biography: chancejs.paragraph({sentences: 5}),
    email:  chancejs.email(),
    password: '123',
    language: 'pt-br',
    active: true,
    gender: 'M',
    cpf: chancejs.cpf(),
    acceptTerms: true
  }
}

stubs.imageDataStub = function imageDataStub() {
  return {
     label: null,
     description: null,
     name: Date.now() + '_16e2b060-c617-11e4-97e6-cd9dacd7f0ff.png',
     size: 11152,
     encoding: '7bit',
     active: true,
     originalname: 'image.png',
     mime: 'image/png',
     extension: 'png',
     width: '289',
     height: '264'
   }
}

stubs.pageStub = function pageStub(userId) {
  return {
    creatorId : userId,
    title: chancejs.sentence({words: 4}),
    about: chancejs.paragraph({sentences: 3}),
    body: chancejs.paragraph({sentences: 5}),
    tags: [
      'Futebol',
      'Jogo',
      'Jogador'
    ],
    categories: [
      'Saúde',
      'Entreterimento'
    ]
  }
}

stubs.groupStub = function groupStub(userId) {
  return {
    creatorId : userId,
    name: chancejs.sentence({words: 4}),
    description: chancejs.paragraph({sentences: 5}),
    tags: [
      'Futebol',
      'Jogo',
      'Jogador'
    ],
    categories: [
      'Saúde',
      'Entreterimento'
    ]
  }
}

stubs.commentStub = function commentStub(userId, modelName, recortToComment) {
  return {
    creatorId : userId,
    modelId: recortToComment.id,
    modelName: modelName,
    body: chancejs.paragraph({sentences: 5})
  }
}

stubs.vocabularyStub = function vocabularyStub(userId, name) {
  return {
    creatorId : userId,
    name: (name || chancejs.word()),
    description: chancejs.paragraph({sentences: 5})
  }
}

stubs.termsStub = function termsStub(userId, vocabularyName) {
  return [
    {
      text: 'Saúde',
      description: chancejs.paragraph({sentences: 5}),
      vocabularyName: vocabularyName
    },
    {
      text: chancejs.word(),
      description: chancejs.paragraph({sentences: 5}),
      vocabularyName: vocabularyName
    },
    {
      text: 'Universe',
      description: chancejs.paragraph({sentences: 5}),
      vocabularyName: vocabularyName
    }
  ]
}

stubs.roomStub = function roomStub() {
  return {
    name: chancejs.sentence({words: 4}),
    description:  chancejs.paragraph({sentences: 5})
  }
}

stubs.messageStub = function termsStub(roomId) {
  return {
    roomId: roomId,
    content: chancejs.paragraph({sentences: 5})
  }
}

stubs.eventStub = function eventStub() {
  return {
    uniquename: chancejs.word({length: 10}),
    title: chancejs.paragraph({words: 5}),
    about: chancejs.paragraph({sentences: 5}),
    registrationManagerName: chancejs.name(),
    registrationManagerEmail: chancejs.email(),
    location: 'Brasil, Rio de Janeiro',

    callForPapersStartDate: chancejs.date({ year: 2000 }),
    callForPapersEndDate: chancejs.date({ year: 2050 }),
    registrationStartDate: chancejs.date({ year: 2000 }),
    registrationEndDate: chancejs.date({ year: 2050 }),
    eventStartDate: chancejs.date({ year: 2000 }),
    eventEndDate: chancejs.date({ year: 2050 })
  }
}

stubs.cfroomStub = function cfroomStub() {
  return {
    name: chancejs.paragraph({words: 3}),
    about: chancejs.paragraph({sentences: 6})
  }
}

stubs.postStub = function postStub(creatorId) {
  return {
    creator: creatorId,
    body: chancejs.paragraph({sentences: 6})
  }
}

module.exports = stubs;