-- Create table for cheque book reorder subscriptions
CREATE TABLE chq_bk_reorder_sub (
    id VARCHAR2(36) PRIMARY KEY,
    cust_ac_no VARCHAR2(20) NOT NULL,
    branch_code VARCHAR2(10) NOT NULL,
    reorder_threshold_number NUMBER NOT NULL,
    subscribed CHAR(1) CHECK (subscribed IN ('Y', 'N')) NOT NULL,
    notify_sms CHAR(1) CHECK (notify_sms IN ('Y', 'N')) NOT NULL,
    notify_email CHAR(1) CHECK (notify_email IN ('Y', 'N')) NOT NULL,
    notify_rm CHAR(1) CHECK (notify_rm IN ('Y', 'N')) NOT NULL,
    created_date DATE DEFAULT SYSDATE,
    updated_date DATE DEFAULT SYSDATE
);

-- Create index on customer account number for faster lookups
CREATE INDEX idx_chq_bk_reorder_cust_ac ON chq_bk_reorder_sub(cust_ac_no);

-- Create index on branch code for filtering
-- CREATE INDEX idx_chq_bk_reorder_branch ON chq_bk_reorder_sub(branch_code);

-- Create table for cheque book requests
CREATE TABLE chq_bk_requests (
    id VARCHAR2(36) PRIMARY KEY,
    cust_ac_no VARCHAR2(20) NOT NULL,
    branch_code VARCHAR2(10) NOT NULL,
    cheque_book_type VARCHAR2(20) NOT NULL,
    number_of_leaves NUMBER NOT NULL,
    delivery_address VARCHAR2(300) NOT NULL,
    additional_notes VARCHAR2(150),
    auth_status CHAR(1) CHECK (auth_status IN ('A', 'U')) DEFAULT 'U',
    created_by VARCHAR2(50) NOT NULL,
    authorized_by VARCHAR2(50),
    created_at DATE DEFAULT SYSDATE,
    authorized_at DATE
);

-- Create indexes for cheque book requests
CREATE INDEX idx_chq_bk_req_cust_ac ON chq_bk_requests(cust_ac_no);
CREATE INDEX idx_chq_bk_req_branch ON chq_bk_requests(branch_code);
CREATE INDEX idx_chq_bk_req_status ON chq_bk_requests(auth_status);
CREATE INDEX idx_chq_bk_req_created_by ON chq_bk_requests(created_by);