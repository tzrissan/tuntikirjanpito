// IDEA replace
// (\d{1,2}\.\d{1,2}\.)\s*[a-zA-Z\s]*(\d{1,2}:\d\d)[\s-]*(\d{1,2}:\d\d).*(\d)
// { date: '$1', tuloaika: '$2', lahtoaika: '$3', lounaat: $4 },

const demo_data = [
    {id: 1, date: '2.1.', tuloaika: '9:05', lahtoaika: '16:50', lounaat: 1},
    {id: 2, date: '3.1.', tuloaika: '9:10', lahtoaika: '17:30', lounaat: 2},
    {id: 3, date: '4.1.', tuloaika: '9:05', lahtoaika: '17:00', lounaat: 1},
    {id: 4, date: '5.1.', tuloaika: '8:45', lahtoaika: '16:20', lounaat: 1},
    {id: 5, date: '9.1.', tuloaika: '8:50', lahtoaika: '17:25', lounaat: 2},
    {id: 6, date: '10.1.', tuloaika: '9:10', lahtoaika: '18:00', lounaat: 1},
    {id: 7, date: '11.1.', tuloaika: '8:55', lahtoaika: '17:15', lounaat: 1},
    {id: 8, date: '12.1.', tuloaika: '9:05', lahtoaika: '16:00', lounaat: 1}
];

const Tuntikirjanpito = {
    get() {
        return demo_data;
    }
}

export default Tuntikirjanpito;