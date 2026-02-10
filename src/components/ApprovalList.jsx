import { useState } from 'react';
import { formatAddress, formatAllowance } from '../utils/formatters.js';
import { KNOWN_SPENDERS } from '../constants/contracts.js';
import { revokeApproval, waitForRevoke } from '../services/revokeService.js';
import './ApprovalList.css';

export default function ApprovalList({ approvals, signer, onRevoked }) {
    const [revokingId, setRevokingId] = useState(null);
    const [error, setError] = useState(null);
    const [txHash, setTxHash] = useState(null);

    const handleRevoke = async (approval) => {
        const approvalId = `${approval.tokenAddress}-${approval.spender}`;
        setRevokingId(approvalId);
        setError(null);
        setTxHash(null);

        try {
            // Send revoke transaction
            const tx = await revokeApproval(approval.tokenAddress, approval.spender, signer);
            setTxHash(tx.hash);

            // Wait for confirmation
            const receipt = await waitForRevoke(tx);

            if (receipt.status === 1) {
                // Success - notify parent to refresh
                onRevoked(approval);
            } else {
                setError('Transaction failed');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setRevokingId(null);
        }
    };

    const getSpenderLabel = (address) => {
        return KNOWN_SPENDERS[address] || formatAddress(address);
    };

    if (!approvals || approvals.length === 0) {
        return (
            <div className="approval-list-empty">
                <div className="empty-icon">🔒</div>
                <h3>No Active Approvals Found</h3>
                <p>Your wallet has no active token approvals on BSC.</p>
            </div>
        );
    }

    return (
        <div className="approval-list">
            <div className="approval-list-header">
                <h2>Active Token Approvals</h2>
                <p className="approval-count">{approvals.length} approval{approvals.length !== 1 ? 's' : ''} found</p>
            </div>

            {error && (
                <div className="error-banner">
                    <span className="error-icon">⚠️</span>
                    {error}
                </div>
            )}

            {txHash && (
                <div className="success-banner">
                    <span className="success-icon">✓</span>
                    Transaction sent:{' '}
                    <a
                        href={`https://bscscan.com/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View on BscScan
                    </a>
                </div>
            )}

            <div className="approval-grid">
                {approvals.map((approval) => {
                    const approvalId = `${approval.tokenAddress}-${approval.spender}`;
                    const isRevoking = revokingId === approvalId;

                    return (
                        <div key={approvalId} className="approval-card">
                            <div className="approval-card-header">
                                <div className="token-info">
                                    <h3 className="token-name">{approval.tokenName}</h3>
                                    <span className="token-symbol">{approval.tokenSymbol}</span>
                                </div>
                                <div className="allowance-badge">
                                    {formatAllowance(approval.allowance, approval.tokenDecimals)}
                                </div>
                            </div>

                            <div className="approval-details">
                                <div className="detail-row">
                                    <span className="detail-label">Token Contract:</span>
                                    <a
                                        href={`https://bscscan.com/token/${approval.tokenAddress}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="detail-value link"
                                    >
                                        {formatAddress(approval.tokenAddress)}
                                    </a>
                                </div>

                                <div className="detail-row">
                                    <span className="detail-label">Approved Spender:</span>
                                    <a
                                        href={`https://bscscan.com/address/${approval.spender}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="detail-value link"
                                    >
                                        {getSpenderLabel(approval.spender)}
                                    </a>
                                </div>

                                <div className="detail-row">
                                    <span className="detail-label">Allowance:</span>
                                    <span className="detail-value">
                                        {formatAllowance(approval.allowance, approval.tokenDecimals)} {approval.tokenSymbol}
                                    </span>
                                </div>
                            </div>

                            {signer && (
                                <button
                                    className={`revoke-button ${isRevoking ? 'revoking' : ''}`}
                                    onClick={() => handleRevoke(approval)}
                                    disabled={isRevoking}
                                >
                                    {isRevoking ? (
                                        <>
                                            <span className="spinner"></span>
                                            Revoking...
                                        </>
                                    ) : (
                                        <>
                                            <span className="revoke-icon">🚫</span>
                                            Revoke Approval
                                        </>
                                    )}
                                </button>
                            )}

                            {!signer && (
                                <div className="read-only-notice">
                                    ℹ️ Connect your wallet to revoke approvals
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
