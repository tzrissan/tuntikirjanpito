<template>
    <tr>
        <td colspan="3">{{ title }}</td>
        <td>{{ values.tuloaika }}</td>
        <td>{{ values.lahtoaika }}</td>
        <td>{{ values.lounaita | numeral('0.0') }}</td>
        <td>{{ values.tyoaika | aikavali2UiStr }}</td>
        <td>{{ values.kirjaus | numeral('0.0') }} h</td>
        <td>{{ values.kirjausvirheenmuutos | aikavali2UiStr(true) }}</td>
        <td>{{ values.saldo | numeral('0.0') }}</td>
        <td>{{ values.saldomuutos | numeral('+0.00') }} h</td>
        <td></td>
    </tr>
</template>

<script>

    export default {
        name: 'PaivaTilastoRivi',
        props: {
            title: String,
            values: Object
        }
    }

</script>

<style scoped>
    tr {
        color: grey;
        font-size: small;
    }
    td {
        padding: 3px 15px;
        white-space: nowrap;
    }
</style>
