# Voting dApp

## Run in dev

```
pnpm hardhat:node
pnpm hardhat:deploy:localhost
pnpm dev
```

## Test

`pnpm hardhat:test`

Attention : ce projet utilise la toute dernière version de Hardhat (v2.15) et ethers (v6.5).

J'ai utilisé les fixtures, un design pattern proposé par Hardhat permettant de restaurer la
Blockchain locale dans un état donné afin d'améliorer la rapidité des tests.
Le Smart Contract Voting étant une machine à état, une fixture transitionnant le SC dans l'état
"standard" désiré est crée pour chaque test, ainsi on charge la fixture juste avant le test pour
automatiquement amener la Blockchain locale dans l'état souhaité.

J'ai regroupé les tests par fonction, les multiples tests unitaires permettent d'atteindre 100% de
coverage. J'ai utilisé plusieurs tests pour chaque fonction afin de bien tester tous les cas
possibles, notamment les cas limites de tallyVotes par exemple qui ne détecte pas correctement une
égalité entre proposals.
Chaque test unitaire commence par le chargement de la fixture adéquat pour amener la Blockchain dans
l'état souhaité, ensuite toutes les exceptions (revert) sont testées avec leur test dédié.
Les changements de storage du Smart Contract sont également testés indépendamment, avec plusieurs
input différent pour couvrir le plus de cas possibles.

## Coverage

| File       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Lines |
| ---------- | ------- | -------- | ------- | ------- | --------------- |
| Voting.sol | 100     | 100      | 100     | 100     |                 |
| All files  | 100     | 100      | 100     | 100     |                 |

## Deploy contract

`pnpm hardhat:deploy:sepolia`

## Deploy dApp

`git push`
