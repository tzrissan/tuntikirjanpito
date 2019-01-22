<template>
    <tr class="stat">
        <td class="title">{{ title }}</td>
        <td class="kirjaus">{{ values.tot | numeral('0.0') }}</td>
        <td class="kirjaus">{{ values.ma | numeral('0.0') }}</td>
        <td class="kirjaus">{{ values.ti | numeral('0.0') }}</td>
        <td class="kirjaus">{{ values.ke | numeral('0.0') }}</td>
        <td class="kirjaus">{{ values.to | numeral('0.0') }}</td>
        <td class="kirjaus">{{ values.pe | numeral('0.0') }}</td>
        <td class="kirjaus">{{ values.la | numeral('0.0') }}</td>
        <td class="kirjaus">{{ values.su | numeral('0.0') }}</td>
        <td class="kirjausYhteensa">{{ values.kirjausYhteensa | numeral('0.0') }}</td>
        <td class="saldo">{{ values.saldomuutos | numeral('0.0') }}</td>
        <td class="saldo">{{ values.saldo | numeral('0.0') }}</td>
    </tr>
</template>

<script>

    export default {
        name: 'ViikkoTilastoRivi',
        props: {
            title: String,
            values: Object,
            numberFormat: String
        }
    }

</script>

<style scoped>
    .stat {
        color: grey;
        font-size: small;
    }
    td {
        padding: 3px 15px;
        white-space: nowrap;
    }
    .kirjaus, .kirjausYhteensa, .saldo {
        text-align: right;
    }
</style>
