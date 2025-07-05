// File: LifelineVault.move
module LifelineProtocol::LifelineVault {

    use std::signer;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::aptos_coin::AptosCoin;
    use std::error;
    use std::vector;
    use std::option::{Self, Option};

    const E_ALREADY_EXISTS: u64 = 1001;
    const E_NOT_OWNER: u64 = 1002;
    const E_ALREADY_RELEASED: u64 = 1003;
    const E_NOT_AUTHORIZED: u64 = 1004;

    struct Vault has key, store {
        owner: address,
        nominee: address,
        balance: Coin<AptosCoin>,
        is_released: bool
    }

    public entry fun create_vault(
        owner: &signer,
        nominee: address,
        deposit: Coin<AptosCoin>
    ) {
        let addr = signer::address_of(owner);
        assert!(!exists<Vault>(addr), error::invalid_argument(E_ALREADY_EXISTS));

        move_to(owner, Vault {
            owner: addr,
            nominee,
            balance: deposit,
            is_released: false
        });
    }

    public entry fun release_to_nominee(
        admin: &signer,
        owner_address: address
    ) {
        let vault = borrow_global_mut<Vault>(owner_address);
        assert!(!vault.is_released, error::invalid_argument(E_ALREADY_RELEASED));
        // ADMIN ONLY: Replace this check with a real allowlist or oracle in prod
        assert!(signer::address_of(admin) == @0xADMIN, error::permission_denied(E_NOT_AUTHORIZED));

        let coin = Coin::extract(&mut vault.balance);
        Coin::deposit<AptosCoin>(vault.nominee, coin);
        vault.is_released = true;
    }

    public fun get_vault(owner: address): Option<&Vault> {
        if (exists<Vault>(owner)) {
            option::some(&borrow_global<Vault>(owner))
        } else {
            option::none<Vault>()
        }
    }
} 
