# Pucrs Student API

API para os alunos poderem extrair a grade de horários, notas e boleto da PUCRS.

Projeto open source sem qualquer intenção de manter suporte ou causar quaisquer tipos de danos.

Por enquanto existem 3 requisições implementadas, o webapp não possui uma API REST, todas as respostas precisam ser extraídas de um HTML.

Não é possível baixar o pacote pelo NPM (momentaneamente).

Node.js 16.6.0

---

Por enquanto, é necessário pôr os dados de autenticação no arquivo `account.json` dentro da pasta `src/secrets`, exemplo:

```json
{
  "registry": "", 
  "password": "",
  "token": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  "useToken": false
}
```

Registry = Matrícula (8 dígitos)

O token é gerado quando o login é feito, caso tenha um é possível acelerar o processo de login (o token expira após um determinado tempo)

---

- Hours Grid (grade de horários):

```
{
  year: 2021,
  semester: 2,
  hours: [
    {
      periods: [
        { name: 'N', start: '21:00', end: '21:45' },
        { name: 'P', start: '21:45', end: '22:30' }
      ],
      day: 'Segunda',
      disciplineCode: 'XXXXX-XX',
      additional: 'XXXXXX'
    }
  ],
  disciplines: [
    { code: 'XXXXX-XX', name: 'XXXXXXXXXXXXXXXXXXXXX' },
  ]
}
```

- Grade Grid (notas do semestre atual):

```
{
  disciplineGrades: [
    {
      disciplineCode: 'XXXXX-XX',
      disciplineName: 'XXXXXXXXXXXXXXXXXXXXX',
      partialGrade: { T1: 10, T2: 10, NF: 10 },
      classCount: 55,
      absences: 2,
      finalGradeMessage: undefined,
      finalGrade: 10,
      publishDate: 2021-12-01T00:00:00.000Z
    },
    {
      disciplineCode: 'XXXXX-XX',
      disciplineName: 'XXXXXXXXXXXXXXXXXXXXX',
      partialGrade: { T1: 10, T2: 10, TF: 10, NF: undefined },
      classCount: 47,
      absences: 0,
      finalGradeMessage: 'Não publicado',
      finalGrade: undefined,
      publishDate: 2021-12-01T00:00:00.000Z
    },
  ]
}
```

- Bill (boleto):

```
{
  year: 2021,
  semester: 2,
  parcels: X,
  documentNumber: XXXXXXXX,
  expireDate: 2021-12-01T00:00:00.000Z,
  value: XXXXXX,
  totalValue: XXXXXX,
  billUrl: 'https://www.XXXXXXXXXXX.com/YYYYYYYYYYYYY'
}
```
