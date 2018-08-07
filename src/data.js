// IDEA replace
// (\d{1,2}\.\d{1,2}\.)\s*[a-zA-Z\s]*(\d{1,2}:\d\d)[\s-]*(\d{1,2}:\d\d).*(\d)
// { date: '$1.2018', tuloaika: '$2', lahtoaika: '$3', lounaat: $4 },

const demo_data = [
    {id: 1, date: '2018-01-02', tuloaika: '09:05', lahtoaika: '16:50', lounaat: 1},
    {id: 2, date: '2018-01-03', tuloaika: '09:10', lahtoaika: '17:30', lounaat: 2},
    {id: 3, date: '2018-01-04', tuloaika: '09:05', lahtoaika: '17:00', lounaat: 1},
    {id: 4, date: '2018-01-05', tuloaika: '08:45', lahtoaika: '16:20', lounaat: 1},
    {id: 5, date: '2018-01-09', tuloaika: '08:50', lahtoaika: '17:25', lounaat: 2},
    {id: 6, date: '2018-01-10', tuloaika: '09:10', lahtoaika: '18:00', lounaat: 1},
    {id: 7, date: '2018-01-11', tuloaika: '08:55', lahtoaika: '17:15', lounaat: 1},
    {id: 8, date: '2018-01-12', tuloaika: '09:05', lahtoaika: '16:00', lounaat: 1}
];

const Tuntikirjanpito = {
    get() {
        return demo_data;
    }
};

export default Tuntikirjanpito;